
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: 'HTML' | 'CSS' | 'JS';
}

export type AppState = 'LANDING' | 'WAITING' | 'ADMIN' | 'QUIZ' | 'RESULT' | 'CERTIFICATE';

export interface QuizResults {
  score: number;
  totalQuestions: number;
  passed: boolean;
  userName: string;
  date: string;
}

export interface UserApproval {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
}