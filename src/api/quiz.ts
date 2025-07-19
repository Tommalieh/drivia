// src/api/quiz.ts

import axios from "axios";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// Setup axios instance
const API = axios.create({
  baseURL: "http://localhost:5159/api/quizzes",
});

// Attach Bearer token to every request
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

// Start a quiz
export const startQuiz = (data: StartQuizRequest) =>
  API.post<StartQuizResponse>("/start", data).then((res) => res.data);

// Submit a quiz
export interface SubmitQuizRequest {
  quizSessionId: string;
  answers: { questionId: string; userAnswer: boolean }[];
}
export const submitQuiz = (data: SubmitQuizRequest) =>
  API.post("/submit", data);
