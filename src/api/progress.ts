import API from "./base"; // <-- Use shared API instance

export interface ProgressSummary {
  readinessScore: number;
  totalChapters: number;
  completedChapters: number;
  chaptersYouRock: {
    chapterId: string;
    title: string;
    completionRate: number;
  }[];
  chaptersToImprove: {
    chapterId: string;
    title: string;
    completionRate: number;
  }[];
}

export const postSectionProgress = (data: {
  sectionId: string;
  isCompleted?: boolean;
}) => API.post("/theory/progress/section", data);

export const postChapterProgress = (data: {
  chapterId: string;
  isCompleted?: boolean;
}) => API.post("/theory/progress/chapter", data);

export const getProgressSummary = () => API.get<ProgressSummary>("/theory/progress/summary");
