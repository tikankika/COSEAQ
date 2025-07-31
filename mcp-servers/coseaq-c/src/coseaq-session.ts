// COSEAQ-C Session Management
import { v4 as uuidv4 } from 'uuid';

export interface CurriculumAnalysis {
  subject: string;
  gradeLevel: string;
  keyCompetencies: string[];
  learningObjectives: string[];
  contentRequirements: string[];
  assessmentCriteria: string[];
  topics: Array<{
    name: string;
    objectives: string[];
    concepts: string[];
    skills: string[];
  }>;
}

export interface CourseOutline {
  title: string;
  chapters: Array<{
    number: number;
    title: string;
    topics: string[];
    objectives: string[];
    estimatedHours: number;
  }>;
}

export interface ChapterOutline {
  chapterNumber: number;
  title: string;
  introduction: string[];
  syllabusConnections: string[];
  objectives: string[];
  keyConcepts: string[];
  mainBody: {
    sections: Array<{
      title: string;
      content: string;
      theories: string[];
    }>;
  };
  conceptRelationships: string[];
  discussion: {
    currentIssues: string[];
    applications: string[];
    criticalQuestions: string[];
  };
  summary: string[];
}

export class CoseaqSession {
  id: string;
  subject: string;
  gradeLevel: string;
  curriculumAnalysis?: CurriculumAnalysis;
  courseOutline?: CourseOutline;
  chapterOutlines: Map<number, ChapterOutline>;
  currentStep: string;
  history: Array<{
    timestamp: Date;
    action: string;
    data: any;
  }>;

  constructor(subject: string = '', gradeLevel: string = '') {
    this.id = uuidv4();
    this.subject = subject;
    this.gradeLevel = gradeLevel;
    this.chapterOutlines = new Map();
    this.currentStep = 'START';
    this.history = [];
  }

  recordAction(action: string, data: any) {
    this.history.push({
      timestamp: new Date(),
      action,
      data
    });
  }

  setAnalysis(analysis: CurriculumAnalysis) {
    this.curriculumAnalysis = analysis;
    this.recordAction('CURRICULUM_ANALYZED', analysis);
    this.currentStep = 'ANALYSIS_COMPLETE';
  }

  setOutline(outline: CourseOutline) {
    this.courseOutline = outline;
    this.recordAction('OUTLINE_CREATED', outline);
    this.currentStep = 'OUTLINE_COMPLETE';
  }

  addChapterOutline(chapter: ChapterOutline) {
    this.chapterOutlines.set(chapter.chapterNumber, chapter);
    this.recordAction('CHAPTER_OUTLINED', chapter);
  }

  getProgress(): string {
    const steps = ['START', 'DOCUMENTS_UPLOADED', 'ANALYSIS_COMPLETE', 'OUTLINE_COMPLETE', 'CHAPTERS_COMPLETE'];
    const currentIndex = steps.indexOf(this.currentStep);
    const progress = ((currentIndex + 1) / steps.length) * 100;
    return `${progress}% complete - Current step: ${this.currentStep}`;
  }

  toJSON() {
    return {
      id: this.id,
      subject: this.subject,
      gradeLevel: this.gradeLevel,
      curriculumAnalysis: this.curriculumAnalysis,
      courseOutline: this.courseOutline,
      chapterOutlines: Array.from(this.chapterOutlines.entries()).map(([num, outline]) => ({
        number: num,
        outline
      })),
      currentStep: this.currentStep,
      history: this.history
    };
  }

  static fromJSON(data: any): CoseaqSession {
    const session = new CoseaqSession(data.subject, data.gradeLevel);
    session.id = data.id;
    session.curriculumAnalysis = data.curriculumAnalysis;
    session.courseOutline = data.courseOutline;
    session.currentStep = data.currentStep;
    session.history = data.history;
    
    if (data.chapterOutlines) {
      data.chapterOutlines.forEach((item: any) => {
        session.chapterOutlines.set(item.number, item.outline);
      });
    }
    
    return session;
  }
}