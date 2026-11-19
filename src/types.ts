export type CourseLevel = "Beginner" | "Intermediate" | "Advanced" | string;
export interface TranscriptLine {
  id: string;
  start: number;
  end: number;
  text: string;
  speaker?: string;
}
export interface QuizOption {
  id: string;
  label: string;
}
export interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "multi-select" | "drag-order";
  question: string;
  options: QuizOption[];
  correctAnswer: string | string[];
  explanation: string;
  hint?: string;
  codeSnippet?: string;
}
export interface Quiz {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description?: string;
  timeLimitSeconds: number;
  passingScorePercent: number;
  questions: QuizQuestion[];
}
export interface QuizAttempt {
  id: string;
  quizId: string;
  courseId: string;
  moduleId: string;
  scorePercent: number;
  passed: boolean;
  userAnswers: Record<string, string | string[]>;
  timeSpentSeconds: number;
  completedAt: string;
  totalQuestions: number;
  correctCount: number;
}
export interface UserNote {
  id: string;
  courseId: string;
  lessonId: string;
  timestamp: number;
  formattedTime: string;
  content: string;
  createdAt: string;
}
export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  learnerName: string;
  issueDate: string;
  scorePercent: number;
  credentialId: string;
  instructorName: string;
  instructorTitle: string;
  totalHours: string;
}
export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  duration: number;
  videoUrl: string;
  summary: string;
  keyPoints: string[];
  transcript: TranscriptLine[];
  resources: {
    id: string;
    title: string;
    type: string;
    url: string;
    size?: string;
  }[];
  [key: string]: any;
}
export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  quiz?: Quiz;
}
export interface Course {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  thumbnail: string;
  category: string;
  level: CourseLevel;
  totalDurationSeconds: number;
  rating: number;
  reviewsCount: number;
  studentsEnrolled: number;
  badgeName: string;
  featured: boolean;
  instructor: any;
  tags: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  modules: Module[];
}
export interface UserProgressState {
  learnerName: string;
  learnerTitle: string;
  completedLessons: Record<string, boolean>;
  lessonWatchTime: Record<string, number>;
  lastWatched: {
    courseId: string;
    lessonId: string;
    timestamp: number;
    updatedAt: string;
  } | null;
  quizAttempts: Record<string, QuizAttempt[]>;
  notes: UserNote[];
  streak: {
    currentStreak: number;
    maxStreak: number;
    lastActiveDate: string;
    activeDates: string[];
  };
  certificates: Certificate[];
}
