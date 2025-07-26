import API from "./base"; // <-- Use shared API instance

// Type definitions
export interface StartQuizRequest {
  type: "random" | "chapter" | "mistake-driven";
  chapterIds?: string[];
  numberOfQuestions: number;
}

export interface QuizQuestion {
  questionId: string;
  text: string;
  groupTitle?: string;
  imageUrl?: string;
  userAnswer: boolean | null;
}
export interface StartQuizResponse {
  quizSessionId: string;
  questions: QuizQuestion[];
}

export interface SubmitQuizRequest {
  quizSessionId: string;
  answers: { questionId: string; userAnswer: boolean }[];
}

export const startQuiz = (data: StartQuizRequest) =>
  API.post<StartQuizResponse>("/quizzes/start", data).then((res) => res.data);


export const submitQuiz = (data: SubmitQuizRequest) =>
  API.post("/quizzes/submit", data);
