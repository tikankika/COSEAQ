# Kritiska Fixar för COSEAQ-C MCP Server

## Problem: MCP följer inte COSEAQ-C microprompts

### 1. Saknad AI-analys av kursplan

**Problem:**
```typescript
// Nuvarande kod i analyze_curriculum:
return {
  content: [{
    type: "text",
    text: `📊 **Curriculum Analysis Started**\n\n...`
  }]
};
```
Ingen faktisk analys sker!

**Lösning som behövs:**
```typescript
async analyzeCurriculum(content: string, type: string) {
  // Faktisk AI-analys med Claude
  const analysis = await this.claudeAPI.analyze({
    prompt: ANALYSIS_PROMPTS.extractCompetencies,
    content: content
  });
  
  // Strukturerad dialog om tolkning
  const interpretation = await this.dialogueManager.discuss(
    "Hur tolkar du detta lärandemål för dina elever?",
    analysis.competencies
  );
  
  return structuredAnalysis;
}
```

### 2. Saknad Dialog och Microprompts

**Problem:**
- Inga progressiva frågor
- Ingen kontextinsamling
- Ingen iterativ förfining

**Lösning:**
```typescript
class DialogueManager {
  async conductAnalysis(curriculum: string) {
    // Steg 1: Kontextinsamling
    const context = await this.gatherContext([
      "Vilken typ av skola arbetar du på?",
      "Hur många elever och vilka förkunskaper?",
      "Vilka resurser har du tillgång till?"
    ]);
    
    // Steg 2: Progressiv analys med läraren
    const competencies = await this.analyzeWithTeacher(curriculum, context);
    
    // Steg 3: Validering och förfining
    const refined = await this.refineWithFeedback(competencies);
    
    return refined;
  }
}
```

### 3. Saknad Artefaktgenerering

**Problem:**
- Inga strukturerade dokument
- Ingen export
- Inga mallar

**Lösning:**
```typescript
class ArtifactGenerator {
  templates = {
    curriculumAnalysis: require('./templates/curriculum-analysis.hbs'),
    courseOutline: require('./templates/course-outline.hbs'),
    chapterPlan: require('./templates/chapter-plan.hbs')
  };
  
  async generateCurriculumAnalysis(session: Session) {
    const data = {
      metadata: session.metadata,
      competencies: session.analysis.competencies,
      interpretations: session.decisions.interpretations,
      constraints: session.context.constraints
    };
    
    return this.templates.curriculumAnalysis(data);
  }
}
```

### 4. Implementation av COSEAQ-C Steg

#### Step 1: START (Fungerar delvis)
```typescript
// Behöver lägga till:
- Kontextinsamling
- Preferensinställning
- Målsättning för kursen
```

#### Step 2: Constructive Alignment (Saknas helt)
```typescript
// Måste implementera:
- AI-driven dokumentanalys
- Extrahering av lärandemål
- Kompetensidentifiering
- Tolkningsdialog med läraren
```

#### Step 3: Outline Creation (Rudimentär)
```typescript
// Behöver:
- Multiple alternativ (2-3 strukturer)
- För- och nackdelar för varje
- Tidsallokering baserat på kontext
- Iterativ förfining
```

#### Step 4: Chapter Outline (Saknas struktur)
```typescript
// Kräver implementation av:
interface ChapterComponents {
  I_Introduction: string[];           // Punktlista
  II_CourseSyllabus: Citation[];     // Exakta citat
  III_Objectives: Objective[];       // SMART-mål
  IV_ConceptList: Concept[];         // Max 30
  V_MainBody: Section[];             // Strukturerat innehåll
  VI_Relationships: Connection[];    // Konceptkopplingar
  VII_Discussion: Topic[];           // Aktuella frågor
  VIII_Summary: string[];            // Punktlista
}
```

### 5. Kvalitetsvalidering (Saknas helt)

```typescript
class QualityValidator {
  async validateContinuously(decision: any) {
    // Kontrollera täckning
    const coverage = await this.checkCurriculumCoverage();
    
    // Validera tidsfördelning
    const timeBalance = await this.validateTimeAllocation();
    
    // Verifiera förkunskapskrav
    const prerequisites = await this.checkPrerequisiteFlow();
    
    // Säkerställ constructive alignment
    const alignment = await this.verifyAlignment();
    
    return {coverage, timeBalance, prerequisites, alignment};
  }
}
```

## Prioriterad Åtgärdslista

### Omedelbart (Vecka 1)
1. **Implementera faktisk AI-analys**
   - Anslut till Claude API för dokumentanalys
   - Skapa strukturerade analysprompts
   - Returnera verklig data, inte placeholder-text

2. **Bygg grundläggande dialogsystem**
   - State management för konversationer
   - Microprompt-mallar
   - Progressiv informationsinsamling

### Kort sikt (Vecka 2-3)
3. **Skapa artefaktgeneratorer**
   - Mallar för alla dokumenttyper
   - Strukturerad datagenerering
   - Export-funktionalitet

4. **Implementera kvalitetsvalidering**
   - Täckningskontroll
   - Tidsvalidering
   - Förkunskapskontroll

### Medellång sikt (Vecka 4-6)
5. **Full COSEAQ-C implementation**
   - Alla microprompts
   - Komplett dialogflöde
   - Professionella artefakter
   - Iterativ förfining

## Teknisk Skuld att Adressera

1. **Session-hantering** behöver spara faktisk analysdata, inte bara metadata
2. **CurriculumAnalyzer** gör ingen verklig analys - bara skapar tom struktur
3. **AI-prompts** används aldrig - de förbereds men anropas inte
4. **Dialogue flow** existerar inte - bara enstaka tool calls

## Rekommendation

För att COSEAQ-C ska fungera som tänkt måste MCP-servern genomgå en betydande omstrukturering. Den nuvarande implementationen är mer ett "proof of concept" än ett fungerande system. 

Fokusera på att implementera:
1. Verklig AI-analys (viktigast!)
2. Strukturerad dialog
3. Professionella artefakter

Utan dessa kärnfunktioner kommer systemet fortsätta simulera COSEAQ-C snarare än att faktiskt implementera metodiken.