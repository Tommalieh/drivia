import axios from 'axios';

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

const API = axios.create({
  baseURL: 'http://localhost:5159/api/theory/progress',
});

// Auth token setup (same as in theory.ts)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// POST: Section view or complete
export const postSectionProgress = (data: {
  sectionId: string;
  isCompleted?: boolean;
}) => API.post('/section', data);

// POST: Mark chapter as done manually
export const postChapterProgress = (data: {
    chapterId: string;
    isCompleted?: boolean;
  }) => API.post('/chapter', data);

// GET: Progress Summary
export const getProgressSummary = () => API.get('/summary');
