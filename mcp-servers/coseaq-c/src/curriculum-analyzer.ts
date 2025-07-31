// AI-Powered Curriculum Analyzer
import { CurriculumAnalysis } from './coseaq-session.js';
import { ANALYSIS_PROMPTS, formatPrompt } from './ai-prompts.js';

export class CurriculumAnalyzer {
  /**
   * Prepares curriculum documents for AI analysis
   * Returns structured prompts that Claude can use to analyze the curriculum
   */
  static prepareAnalysisPrompts(curriculumText: string, syllabusText: string): Record<string, string> {
    const combinedText = `NATIONAL CURRICULUM:\n${curriculumText}\n\nSYLLABUS:\n${syllabusText}`;
    
    return {
      competencies: formatPrompt(ANALYSIS_PROMPTS.extractCompetencies, { document: combinedText }),
      objectives: formatPrompt(ANALYSIS_PROMPTS.extractLearningObjectives, { document: combinedText }),
      topics: formatPrompt(ANALYSIS_PROMPTS.extractTopics, { document: combinedText }),
      assessment: formatPrompt(ANALYSIS_PROMPTS.extractAssessmentCriteria, { document: combinedText })
    };
  }

  /**
   * Creates a basic analysis structure with prompts for AI to fill
   * This is used when we need immediate feedback while waiting for full AI analysis
   */
  static createBasicAnalysis(curriculumText: string, syllabusText: string): CurriculumAnalysis {
    const analysis: CurriculumAnalysis = {
      subject: '',
      gradeLevel: '',
      keyCompetencies: [],
      learningObjectives: [],
      contentRequirements: [],
      assessmentCriteria: [],
      topics: []
    };

    // Quick extraction of subject and grade level for immediate feedback
    const subjectMatch = curriculumText.match(/(?:ämne|subject|kurs|course):\s*([^\n]+)/i);
    if (subjectMatch) {
      analysis.subject = subjectMatch[1].trim();
    }

    const gradeMatch = curriculumText.match(/(?:årskurs|grade|nivå|level):\s*([^\n]+)/i);
    if (gradeMatch) {
      analysis.gradeLevel = gradeMatch[1].trim();
    }

    // Add placeholder data that indicates AI analysis is needed
    analysis.keyCompetencies = ["AI analysis pending..."];
    analysis.learningObjectives = ["AI analysis pending..."];
    analysis.contentRequirements = ["AI analysis pending..."];
    analysis.assessmentCriteria = ["AI analysis pending..."];
    analysis.topics = [{
      name: "AI analysis pending",
      objectives: [],
      concepts: [],
      skills: []
    }];

    return analysis;
  }

  /**
   * DEPRECATED: Old pattern-based analysis
   * Kept for fallback if AI analysis fails
   */
  static analyze(curriculumText: string, syllabusText: string): CurriculumAnalysis {
    // For now, return basic analysis
    // In production, this would make actual AI calls
    return this.createBasicAnalysis(curriculumText, syllabusText);
  }

  private static extractSection(text: string, keywords: string[]): string[] {
    const results: string[] = [];
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      const trimmedLine = lines[i].trim();
      
      // Check if line contains any keyword
      if (keywords.some(keyword => line.includes(keyword.toLowerCase()))) {
        // Collect this line and potentially following lines
        if (trimmedLine.length > 10) {
          results.push(trimmedLine);
        }
        
        // Look for bullet points or numbered lists after keyword
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          const nextLine = lines[j].trim();
          if (nextLine.match(/^[\-•*▪︎\d]+[\.\)]\s*.+/) || 
              (nextLine.length > 20 && !nextLine.match(/^[A-ZÅÄÖ]/))) {
            results.push(nextLine);
          } else if (nextLine.length === 0) {
            continue;
          } else {
            break;
          }
        }
      }
    }
    
    // Remove duplicates and clean up
    return [...new Set(results)]
      .filter(item => item.length > 15)
      .map(item => item.replace(/^[\-•*▪︎\d]+[\.\)]\s*/, ''));
  }

  private static extractTopics(text: string): Array<{
    name: string;
    objectives: string[];
    concepts: string[];
    skills: string[];
  }> {
    const topics: Array<{
      name: string;
      objectives: string[];
      concepts: string[];
      skills: string[];
    }> = [];

    // Common topic indicators
    const topicPatterns = [
      /^#{1,3}\s+(.+)$/gm,  // Markdown headers
      /^(?:\d+\.)+\s*(.+)$/gm,  // Numbered sections
      /^[A-ZÅÄÖ][^.!?]*:$/gm,  // Capitalized labels
    ];

    const topicNames = new Set<string>();
    
    for (const pattern of topicPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const topicName = match[1] || match[0];
        if (topicName.length > 5 && topicName.length < 100) {
          topicNames.add(topicName.trim());
        }
      }
    }

    // For each topic, try to extract related content
    for (const name of topicNames) {
      const topic = {
        name: name.replace(/[:.\-–—]/g, '').trim(),
        objectives: [] as string[],
        concepts: [] as string[],
        skills: [] as string[]
      };

      // Find the topic in text and extract following content
      const topicIndex = text.indexOf(name);
      if (topicIndex !== -1) {
        const topicSection = text.substring(topicIndex, topicIndex + 2000);
        
        // Extract objectives (mål, syfte)
        const objLines = topicSection.match(/(?:mål|syfte|objective)[^.]*[.:]\s*([^.]+\.)/gi);
        if (objLines) {
          topic.objectives = objLines.map(line => line.replace(/(?:mål|syfte|objective)[^.:]*[.:]\s*/i, '').trim());
        }

        // Extract concepts (begrepp, koncept)
        const conceptLines = topicSection.match(/(?:begrepp|koncept|concept)[^.]*[.:]\s*([^.]+\.)/gi);
        if (conceptLines) {
          topic.concepts = conceptLines.map(line => line.replace(/(?:begrepp|koncept|concept)[^.:]*[.:]\s*/i, '').trim());
        }

        // Extract skills (färdighet, förmåga)
        const skillLines = topicSection.match(/(?:färdighet|förmåga|skill|abilit)[^.]*[.:]\s*([^.]+\.)/gi);
        if (skillLines) {
          topic.skills = skillLines.map(line => line.replace(/(?:färdighet|förmåga|skill|abilit)[^.:]*[.:]\s*/i, '').trim());
        }
      }

      if (topic.objectives.length > 0 || topic.concepts.length > 0 || topic.skills.length > 0) {
        topics.push(topic);
      }
    }

    return topics.slice(0, 10); // Limit to 10 most relevant topics
  }

  /**
   * Generate intelligent questions based on the analysis
   */
  static generateQuestions(analysis: CurriculumAnalysis): string[] {
    const questions: string[] = [];

    // Questions about competencies
    if (analysis.keyCompetencies.length > 0) {
      questions.push(
        `I found ${analysis.keyCompetencies.length} key competencies. Which ones are most critical for your students?`,
        `Should we prioritize any specific competency for early chapters?`
      );
    }

    // Questions about objectives
    if (analysis.learningObjectives.length > 0) {
      questions.push(
        `How would you like to sequence these ${analysis.learningObjectives.length} learning objectives?`,
        `Are there any implicit objectives not clearly stated in the curriculum?`
      );
    }

    // Questions about topics
    if (analysis.topics.length > 0) {
      questions.push(
        `I identified ${analysis.topics.length} main topics. What's the ideal order for teaching them?`,
        `Which topics do students typically find most challenging?`
      );
    }

    // Questions about assessment
    if (analysis.assessmentCriteria.length > 0) {
      questions.push(
        `How do you prefer to align content with these assessment criteria?`,
        `Should each chapter explicitly address specific assessment points?`
      );
    }

    return questions;
  }

  /**
   * Generate course outline suggestion based on analysis
   */
  static suggestOutline(analysis: CurriculumAnalysis): any {
    const chapters = [];
    const topicsPerChapter = Math.ceil(analysis.topics.length / 8); // Aim for 8 chapters

    for (let i = 0; i < analysis.topics.length; i += topicsPerChapter) {
      const chapterTopics = analysis.topics.slice(i, i + topicsPerChapter);
      const chapterNumber = Math.floor(i / topicsPerChapter) + 1;
      
      chapters.push({
        number: chapterNumber,
        title: `Chapter ${chapterNumber}: ${chapterTopics[0]?.name || 'Introduction'}`,
        topics: chapterTopics.map(t => t.name),
        objectives: chapterTopics.flatMap(t => t.objectives).slice(0, 5),
        estimatedHours: chapterTopics.length * 4 // Rough estimate
      });
    }

    return {
      title: `${analysis.subject} - ${analysis.gradeLevel}`,
      chapters
    };
  }
}