import { z } from 'zod';

// Dialogue state management
export interface DialogueState {
  currentPhase: DialoguePhase;
  currentStep: number;
  context: TeacherContext;
  decisions: Decision[];
  pendingClarifications: string[];
}

export type DialoguePhase = 
  | 'CONTEXT_GATHERING'
  | 'CURRICULUM_INTERPRETATION' 
  | 'STRUCTURE_DESIGN'
  | 'CONTENT_PLANNING'
  | 'VALIDATION'
  | 'ARTIFACT_GENERATION';

export interface TeacherContext {
  schoolType?: string;
  studentCount?: number;
  studentGoals?: string[];
  availableResources?: string[];
  timeConstraints?: string;
  teachingPhilosophy?: string;
  localPriorities?: string[];
}

export interface Decision {
  id: string;
  timestamp: Date;
  phase: DialoguePhase;
  question: string;
  options: string[];
  choice: string;
  rationale: string;
}

export interface DialogueResponse {
  message: string;
  options?: string[];
  expectedInputType: 'choice' | 'text' | 'number';
  nextStep: string;
  helpText?: string;
}

// Microprompt templates
const MICROPROMPTS = {
  contextGathering: {
    schoolType: {
      message: "Låt oss börja med att förstå din undervisningskontext. Vilken typ av skola arbetar du på?",
      options: ["Kommunal gymnasieskola", "Friskola", "Komvux", "Folkhögskola", "Annan"],
      expectedInputType: 'choice' as const,
      nextStep: 'studentProfile'
    },
    studentProfile: {
      message: "Hur många elever brukar du ha per klass, och vad är deras typiska bakgrund?",
      expectedInputType: 'text' as const,
      nextStep: 'studentGoals',
      helpText: "T.ex. '25 elever, de flesta från akademiska hem' eller '15 elever, blandad bakgrund'"
    },
    studentGoals: {
      message: "Vad är elevernas huvudsakliga mål efter kursen?",
      options: [
        "Högskoleförberedande (medicin/naturvetenskap)",
        "Högskoleförberedande (teknik/ingenjör)", 
        "Yrkesförberedande",
        "Allmänbildning",
        "Blandat"
      ],
      expectedInputType: 'choice' as const,
      nextStep: 'resources'
    },
    resources: {
      message: "Vilka resurser har du tillgång till för praktiskt arbete?",
      expectedInputType: 'text' as const,
      nextStep: 'timeConstraints',
      helpText: "Beskriv labb-utrustning, fältstudieplatser, digitala verktyg etc."
    },
    timeConstraints: {
      message: "Finns det särskilda tidsbegränsningar eller schemaläggningsfaktorer att ta hänsyn till?",
      expectedInputType: 'text' as const,
      nextStep: 'complete',
      helpText: "T.ex. 'Endast 80-minuterspass', 'Delad labbsal', 'Många röda dagar på våren'"
    }
  },
  
  curriculumInterpretation: {
    competencyInterpretation: (competency: string) => ({
      message: `Jag hittade denna kompetens i kursplanen:\n\n"${competency}"\n\nDetta kan tolkas på flera sätt. Hur prioriterar du denna för dina elever?`,
      options: [
        "Fokusera på praktisk tillämpning",
        "Betona teoretisk förståelse",
        "Balansera teori och praktik",
        "Anpassa individuellt efter elev"
      ],
      expectedInputType: 'choice' as const,
      nextStep: 'competencyDepth'
    }),
    competencyDepth: {
      message: "Hur djupt ska vi gå i denna kompetens? Beskriv gärna med exempel.",
      expectedInputType: 'text' as const,
      nextStep: 'nextCompetency',
      helpText: "T.ex. 'Grundläggande förståelse räcker' eller 'Djupgående, eleverna ska kunna tillämpa i nya situationer'"
    }
  },
  
  structureDesign: {
    structureChoice: (options: any[]) => ({
      message: "Baserat på vår analys har jag tagit fram tre möjliga kursstrukturer. Vilken passar bäst för dina elever?\n\n" +
               options.map((opt, i) => `${i+1}. ${opt.name}\n   ${opt.description}\n   För: ${opt.pros}\n   Emot: ${opt.cons}`).join('\n\n'),
      options: options.map(o => o.name),
      expectedInputType: 'choice' as const,
      nextStep: 'structureRefinement'
    }),
    structureRefinement: {
      message: "Vill du justera något i den valda strukturen?",
      expectedInputType: 'text' as const,
      nextStep: 'timeAllocation',
      helpText: "T.ex. 'Mer tid på cellbiologi', 'Slå ihop två kapitel', eller 'Nej, den ser bra ut'"
    }
  }
};

export class DialogueManager {
  private state: DialogueState;
  private sessionId: string;
  
  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.state = {
      currentPhase: 'CONTEXT_GATHERING',
      currentStep: 0,
      context: {},
      decisions: [],
      pendingClarifications: []
    };
  }
  
  async startDialogue(): Promise<DialogueResponse> {
    return this.getNextPrompt();
  }
  
  async processResponse(input: string): Promise<DialogueResponse> {
    // Save the response
    await this.saveDecision(input);
    
    // Update state based on response
    this.updateContext(input);
    
    // Move to next step
    this.advanceStep();
    
    // Get next prompt
    return this.getNextPrompt();
  }
  
  private getNextPrompt(): DialogueResponse {
    const phase = this.state.currentPhase;
    
    switch (phase) {
      case 'CONTEXT_GATHERING':
        return this.getContextGatheringPrompt();
      case 'CURRICULUM_INTERPRETATION':
        return this.getCurriculumInterpretationPrompt();
      case 'STRUCTURE_DESIGN':
        return this.getStructureDesignPrompt();
      default:
        return {
          message: "Vi har slutfört den inledande dialogen. Redo att skapa artefakter?",
          expectedInputType: 'choice',
          options: ['Ja', 'Låt mig se sammanfattning först'],
          nextStep: 'complete'
        };
    }
  }
  
  private getContextGatheringPrompt(): DialogueResponse {
    const steps = Object.keys(MICROPROMPTS.contextGathering);
    const currentStepKey = steps[this.state.currentStep];
    
    if (!currentStepKey || currentStepKey === 'complete') {
      // Move to next phase
      this.state.currentPhase = 'CURRICULUM_INTERPRETATION';
      this.state.currentStep = 0;
      return this.getCurriculumInterpretationPrompt();
    }
    
    return MICROPROMPTS.contextGathering[currentStepKey as keyof typeof MICROPROMPTS.contextGathering];
  }
  
  private getCurriculumInterpretationPrompt(): DialogueResponse {
    // This would integrate with the AI analysis results
    return {
      message: "Nu ska vi tolka kursplanen tillsammans. Använd 'analyze_curriculum' först för att få AI-analys av dokumentet.",
      expectedInputType: 'text',
      nextStep: 'waitingForAnalysis'
    };
  }
  
  private getStructureDesignPrompt(): DialogueResponse {
    // This would use the analysis to present structure options
    const mockOptions = [
      {
        name: "Traditionell progression",
        description: "Cell → Genetik → Evolution → Ekologi",
        pros: "Logisk kunskapsuppbyggnad",
        cons: "Kan kännas fragmenterad"
      },
      {
        name: "Tematisk integration",
        description: "Livsprocesser → Mångfald → Samspel → Hållbarhet",
        pros: "Visar sammanhang",
        cons: "Kräver mer planering"
      }
    ];
    
    return MICROPROMPTS.structureDesign.structureChoice(mockOptions);
  }
  
  private async saveDecision(input: string): Promise<void> {
    const decision: Decision = {
      id: `decision-${Date.now()}`,
      timestamp: new Date(),
      phase: this.state.currentPhase,
      question: this.getCurrentQuestion(),
      options: this.getCurrentOptions(),
      choice: input,
      rationale: '' // Would be filled in follow-up
    };
    
    this.state.decisions.push(decision);
  }
  
  private updateContext(input: string): void {
    // Update context based on current step
    const phase = this.state.currentPhase;
    
    if (phase === 'CONTEXT_GATHERING') {
      const steps = Object.keys(MICROPROMPTS.contextGathering);
      const currentStepKey = steps[this.state.currentStep];
      
      switch (currentStepKey) {
        case 'schoolType':
          this.state.context.schoolType = input;
          break;
        case 'studentProfile':
          // Parse student count from text
          const match = input.match(/(\d+)/);
          if (match) {
            this.state.context.studentCount = parseInt(match[1]);
          }
          break;
        case 'studentGoals':
          this.state.context.studentGoals = [input];
          break;
        case 'resources':
          this.state.context.availableResources = input.split(',').map(r => r.trim());
          break;
        case 'timeConstraints':
          this.state.context.timeConstraints = input;
          break;
      }
    }
  }
  
  private advanceStep(): void {
    this.state.currentStep++;
  }
  
  private getCurrentQuestion(): string {
    // Get current question based on state
    return "Current question"; // Placeholder
  }
  
  private getCurrentOptions(): string[] {
    // Get current options based on state
    return []; // Placeholder
  }
  
  getState(): DialogueState {
    return this.state;
  }
  
  getSummary(): string {
    let summary = "## Sammanfattning av dina val\n\n";
    
    summary += "### Kontext\n";
    summary += `- Skoltyp: ${this.state.context.schoolType || 'Ej angiven'}\n`;
    summary += `- Antal elever: ${this.state.context.studentCount || 'Ej angivet'}\n`;
    summary += `- Elevmål: ${this.state.context.studentGoals?.join(', ') || 'Ej angivna'}\n`;
    summary += `- Resurser: ${this.state.context.availableResources?.join(', ') || 'Ej angivna'}\n`;
    
    summary += "\n### Beslut\n";
    for (const decision of this.state.decisions) {
      summary += `- ${decision.question}: ${decision.choice}\n`;
      if (decision.rationale) {
        summary += `  Motivering: ${decision.rationale}\n`;
      }
    }
    
    return summary;
  }
}