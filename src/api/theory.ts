import API from "./base"; // <-- Use shared API instance

// Fetch all chapters
export const getChapters = () => API.get("/theory/chapters");

// Fetch a single chapter (with its sections) by ID
export const getChapterById = (id: string) => API.get(`/theory/chapters/${id}`);
