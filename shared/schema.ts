import { z } from "zod";

export const grades = [6, 7, 8] as const;
export type Grade = typeof grades[number];

export interface Chapter {
  id: string;
  grade: Grade;
  title: string;
  subject: string;
}

export interface LessonContent {
  chapterId: string;
  text: string;
  imageUrl: string;
  audioUrl: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  chapterId: string;
  questions: QuizQuestion[];
}

export interface StudentAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timestamp: number;
}

export interface QuizAttempt {
  chapterId: string;
  grade: Grade;
  answers: StudentAnswer[];
  score: number;
  totalQuestions: number;
  timestamp: number;
  studentId?: string;
}

export interface AIFeedback {
  type: 'remedial' | 'challenge';
  content: string;
  hint?: string;
}

export interface StudentScore {
  studentId: string;
  grade: Grade;
  chapter: string;
  score: number;
  timestamp: number;
}

export const studentScoreSchema = z.object({
  studentId: z.string(),
  grade: z.union([z.literal(6), z.literal(7), z.literal(8)]),
  chapter: z.string(),
  score: z.number().min(0).max(100),
  timestamp: z.number(),
});

export type InsertStudentScore = z.infer<typeof studentScoreSchema>;

export interface DashboardData {
  [key: string]: Array<{
    student: string;
    score: number;
    timestamp: number;
  }>;
}
