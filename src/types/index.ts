export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  answers?: string[];
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  timeRemaining: number;
  isFinished: boolean;
  answers: (string | null)[];
}

export interface User {
  username: string;
  email?: string;
  isLoggedIn: boolean;
  password?: string;
}
