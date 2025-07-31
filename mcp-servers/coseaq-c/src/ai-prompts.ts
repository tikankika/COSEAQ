// AI Prompt Templates for COSEAQ-C Analysis

export const ANALYSIS_PROMPTS = {
  extractCompetencies: `Analyze this curriculum document and extract ALL key competencies (kompetenser/förmågor).

Format your response as a JSON array of strings, where each string is a clearly stated competency.
Focus on abilities students should develop, not just knowledge areas.

Example format:
["Ability to analyze scientific phenomena", "Critical thinking in problem-solving", ...]

Document to analyze:
---
{document}
---

Respond ONLY with the JSON array.`,

  extractLearningObjectives: `Extract all learning objectives (lärandemål/kunskapsmål) from this curriculum.

Include both explicit and implicit objectives. Format as JSON array of strings.
Each objective should start with an action verb (e.g., "Understand", "Apply", "Analyze").

Document to analyze:
---
{document}
---

Respond ONLY with the JSON array.`,

  extractTopics: `Identify all main topics and subtopics in this curriculum.

Format as JSON array of objects with this structure:
[{
  "name": "Topic name",
  "objectives": ["Related objectives..."],
  "concepts": ["Key concepts..."],
  "skills": ["Required skills..."]
}]

Document to analyze:
---
{document}
---

Respond ONLY with the JSON array.`,

  extractAssessmentCriteria: `Extract all assessment criteria and grading requirements from this curriculum.

Include criteria for different grade levels (E, C, A) if present.
Format as JSON array of strings describing each criterion.

Document to analyze:
---
{document}
---

Respond ONLY with the JSON array.`,

  generateQuestions: `Based on this curriculum analysis, generate 5-7 specific questions a teacher should consider when planning their course.

Questions should be:
- Practical and actionable
- Related to local context and student needs
- About sequencing, emphasis, and adaptation

Analysis data:
{analysisData}

Format as JSON array of question strings.`,

  suggestCourseStructure: `Based on this curriculum analysis, suggest a course structure with chapters.

Consider:
- Logical progression of topics
- Time allocation (total ~120 hours for a full course)
- Integration between topics
- Assessment alignment

Analysis data:
{analysisData}

Format response as:
{
  "title": "Course title",
  "rationale": "Brief explanation of the structure",
  "chapters": [{
    "number": 1,
    "title": "Chapter title",
    "topics": ["Topic 1", "Topic 2"],
    "objectives": ["Objective 1", "Objective 2"],
    "estimatedHours": 15,
    "keyActivities": ["Lab work", "Discussion"]
  }]
}`
};

export const DIALOGUE_PROMPTS = {
  reviewFeedback: `The teacher provided this feedback on the curriculum analysis:
"{feedback}"

Current analysis:
{currentAnalysis}

How should we adjust the analysis based on this feedback? Provide specific changes.`,

  chapterPlanning: `Let's plan Chapter {chapterNumber} together.

Course outline: {courseOutline}
Curriculum requirements: {requirements}
Teacher preferences: {preferences}

Generate a detailed chapter plan including:
- Learning progression
- Key concepts (max 20)
- Suggested activities
- Assessment ideas
- Common misconceptions to address`,

  adaptToContext: `The teacher wants to adapt the curriculum for their specific context:

Context: {context}
Student needs: {studentNeeds}
Available resources: {resources}

How should we modify our course plan to better fit this context?`
};

/**
 * Format a prompt with data
 */
export function formatPrompt(template: string, data: Record<string, any>): string {
  let formatted = template;
  
  for (const [key, value] of Object.entries(data)) {
    const placeholder = `{${key}}`;
    const replacement = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
    formatted = formatted.replace(new RegExp(placeholder, 'g'), replacement);
  }
  
  return formatted;
}