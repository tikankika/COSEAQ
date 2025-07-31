# COSEAQ-C Artifacts Specification

## Overview

This document specifies the high-quality artifacts that the COSEAQ-C MCP server should produce. Each artifact serves a specific purpose in the course planning process and must meet defined quality criteria.

## 1. Curriculum Analysis Report

### Purpose
Document the teacher's interpretation of curriculum requirements and provide a foundation for course design.

### Structure
```yaml
curriculum_analysis:
  metadata:
    subject: "Biology"
    level: "Gymnasium Year 1"
    curriculum_version: "GY11"
    analysis_date: "2025-07-31"
    teacher: "Name"
    
  competencies:
    - id: "C1"
      original_text: "Kunskaper om biologins begrepp, modeller, teorier..."
      interpretation: "Students need foundational knowledge of biological concepts,
                      focusing on cellular biology, ecology, and evolution"
      knowledge_areas:
        - "Cell structure and function"
        - "Ecosystem interactions"
        - "Evolutionary mechanisms"
      skills:
        - "Identify and explain biological concepts"
        - "Apply models to biological phenomena"
        
  learning_objectives:
    - id: "LO1"
      competency_ref: "C1"
      objective: "Explain the structure and function of prokaryotic and eukaryotic cells"
      bloom_level: "Understand"
      measurable_criteria:
        - "Can identify 10 key cell organelles"
        - "Can explain the function of each organelle"
        - "Can compare prokaryotic and eukaryotic cells"
        
  constraints:
    time_available: "100 hours"
    resources:
      - "Limited lab equipment"
      - "No dedicated computer lab"
    student_prerequisites:
      - "Basic chemistry from grade 9"
      - "Elementary scientific method"
      
  considerations:
    - "Students have varied backgrounds in science"
    - "Local environment offers field study opportunities"
    - "University preparation is priority for 70% of students"
```

### Quality Criteria
- ✓ All curriculum requirements are addressed
- ✓ Interpretations are pedagogically justified
- ✓ Objectives are measurable and specific
- ✓ Constraints are realistically assessed
- ✓ Local context is considered

## 2. Course Outline

### Purpose
Provide the overall structure and timeline for the course, showing how all elements fit together.

### Structure
```yaml
course_outline:
  metadata:
    title: "Biology 1"
    duration: "100 hours"
    chapters: 8
    major_assessments: 4
    
  structure:
    - chapter: 1
      title: "Introduction to Biology & Scientific Method"
      allocated_hours: 10
      topics:
        - "What is biology?"
        - "Scientific investigation"
        - "Lab safety and techniques"
      competencies: ["C1", "C4"]
      assessment: "Lab report on basic microscopy"
      
    - chapter: 2
      title: "Cell Biology"
      allocated_hours: 18
      topics:
        - "Cell theory and history"
        - "Prokaryotic cells"
        - "Eukaryotic cells"
        - "Cell membrane and transport"
      competencies: ["C1", "C2"]
      assessment: "Chapter test + Cell model project"
      
  assessment_plan:
    formative:
      - "Weekly quizzes"
      - "Lab notebook checks"
      - "Peer review activities"
    summative:
      - assessment: "Midterm Exam"
        chapters: [1, 2, 3, 4]
        weight: "25%"
        format: "Written exam + practical"
      - assessment: "Final Project"
        chapters: "All"
        weight: "30%"
        format: "Research project with presentation"
        
  resource_distribution:
    lectures: "40 hours"
    laboratory: "25 hours"
    group_work: "20 hours"
    assessment: "15 hours"
```

### Quality Criteria
- ✓ Time allocations sum to total available hours
- ✓ All competencies are covered
- ✓ Assessment strategy is balanced
- ✓ Progression is logical and builds knowledge
- ✓ Resource use is specified and feasible

## 3. Chapter Outlines

### Purpose
Detailed planning for each chapter ensuring complete coverage and clear learning progression.

### Structure
```yaml
chapter_outline:
  metadata:
    chapter_number: 2
    title: "Cell Biology"
    duration: "18 hours"
    
  introduction:
    - "Cells as the fundamental unit of life"
    - "Historical development of cell theory"
    - "Diversity of cell types and their importance"
    
  syllabus_connections:
    - reference: "Centralt innehåll - Cellbiologi"
      quote: "Cellers uppbyggnad och funktion samt några livsprocesser..."
      interpretation: "Focus on structure-function relationships"
      
  objectives:
    - "Describe the principles of cell theory"
    - "Compare and contrast prokaryotic and eukaryotic cells"
    - "Explain the function of major cell organelles"
    - "Analyze how cell structure relates to function"
    
  concepts: # Maximum 30
    - "Cell theory"
    - "Prokaryote"
    - "Eukaryote"
    - "Cell membrane"
    - "Nucleus"
    - "Mitochondria"
    - "Chloroplast"
    [... up to 30 concepts]
    
  content_sequence:
    - section: "2.1 Cell Theory and History"
      duration: "2 hours"
      content:
        - "Hooke, Leeuwenhoek discoveries"
        - "Schleiden, Schwann contributions"
        - "Modern cell theory principles"
      activities:
        - "Timeline creation activity"
        - "Microscope history demonstration"
        
    - section: "2.2 Prokaryotic Cells"
      duration: "3 hours"
      content:
        - "Bacterial cell structure"
        - "Archaea characteristics"
        - "Reproduction in prokaryotes"
      activities:
        - "Bacterial culture observation"
        - "Diagram annotation exercise"
        
  assessment_tasks:
    formative:
      - "Concept map of cell organelles"
      - "Laboratory drawings with annotations"
    summative:
      - "Chapter test: 30 multiple choice, 5 short answer"
      - "Cell model project with presentation"
      
  differentiation:
    extension:
      - "Research project on extremophile cells"
      - "Advanced microscopy techniques"
    support:
      - "Simplified cell diagrams"
      - "Vocabulary flashcards"
      - "Peer tutoring for lab work"
```

### Quality Criteria
- ✓ Clear introduction sets context
- ✓ Objectives are specific and measurable
- ✓ Content sequence is logical
- ✓ Activities support objectives
- ✓ Assessment aligns with objectives
- ✓ Differentiation addresses diverse needs

## 4. Alignment Matrix

### Purpose
Demonstrate complete curriculum coverage and validate the course design.

### Structure
```yaml
alignment_matrix:
  curriculum_to_content:
    - curriculum_req: "Cellers uppbyggnad och funktion"
      chapters: [2, 3]
      activities:
        - "Cell structure lab"
        - "Organelle function investigation"
      assessments:
        - "Cell biology test"
        - "Lab practical exam"
      coverage: "Complete"
      
    - curriculum_req: "Evolutionens mekanismer"
      chapters: [6, 7]
      activities:
        - "Natural selection simulation"
        - "Fossil record analysis"
      assessments:
        - "Evolution essay"
        - "Case study presentation"
      coverage: "Complete"
      
  time_distribution:
    total_hours: 100
    by_competency:
      C1_knowledge: 40
      C2_methods: 25
      C3_analysis: 20
      C4_communication: 15
    by_activity:
      direct_instruction: 40
      laboratory: 25
      group_work: 20
      assessment: 15
      
  assessment_alignment:
    - objective: "Explain cell structure"
      teaching_activities: ["Lecture", "Lab", "Model building"]
      assessment_method: "Diagram labeling + explanation"
      validity: "High - directly measures ability"
      
  prerequisite_flow:
    - topic: "Basic chemistry"
      required_for: ["Cell membrane", "Photosynthesis", "DNA"]
      when_taught: "Chapter 1"
    - topic: "Cell structure"
      required_for: ["Cell division", "Genetics"]
      when_taught: "Chapter 2"
```

### Quality Criteria
- ✓ Every curriculum requirement is mapped
- ✓ No significant gaps in coverage
- ✓ Time distribution is balanced
- ✓ Prerequisites are properly sequenced
- ✓ Assessments validly measure objectives

## 5. Session Progress Report

### Purpose
Track the collaborative process and decisions made during course planning.

### Structure
```yaml
session_progress:
  metadata:
    session_id: "uuid"
    started: "2025-07-31T10:00:00"
    participants: ["Teacher Name", "COSEAQ-C AI"]
    
  decisions_made:
    - step: "Curriculum Analysis"
      decisions:
        - decision: "Interpret 'biological models' to include both physical and conceptual"
          rationale: "Students need concrete and abstract thinking skills"
        - decision: "Allocate 20% time to investigation skills"
          rationale: "University preparation requires strong research skills"
          
    - step: "Course Structure"
      decisions:
        - decision: "Start with cell biology before ecology"
          rationale: "Understanding cells is prerequisite for ecosystem interactions"
          
  iterations:
    - version: 1
      timestamp: "2025-07-31T10:30:00"
      changes: "Initial structure with 10 chapters"
      
    - version: 2
      timestamp: "2025-07-31T11:15:00"
      changes: "Consolidated to 8 chapters for better time management"
      teacher_feedback: "Too many topics would be rushed"
      
  quality_checks:
    curriculum_coverage: "100%"
    time_balance: "Optimal"
    prerequisite_flow: "Logical"
    assessment_variety: "Good"
    
  next_steps:
    - "Develop detailed content for Chapter 1"
    - "Create laboratory exercise plans"
    - "Design rubrics for major assessments"
```

### Quality Criteria
- ✓ All major decisions are documented
- ✓ Rationale is captured for future reference
- ✓ Iterations show improvement
- ✓ Quality metrics are tracked
- ✓ Clear action items for continuation

## Implementation Guidelines

### 1. Progressive Generation
Artifacts should be generated progressively:
1. Curriculum Analysis Report → 
2. Course Outline → 
3. Chapter Outlines → 
4. Alignment Matrix

### 2. Iterative Refinement
Each artifact should support:
- Multiple versions
- Change tracking
- Teacher feedback incorporation
- Quality improvement metrics

### 3. Format Flexibility
While shown in YAML for clarity, artifacts should be available in:
- JSON for data processing
- Markdown for readability
- PDF for formal documentation
- HTML for web viewing

### 4. Validation Rules
Each artifact must pass validation:
- Required fields are present
- Cross-references are valid
- Calculations are correct
- Quality criteria are met

## Conclusion

These artifacts represent the tangible outcomes of the COSEAQ-C process. They transform abstract curriculum requirements into concrete, actionable course plans that teachers can implement with confidence. The quality and completeness of these artifacts directly impact the success of the resulting course.