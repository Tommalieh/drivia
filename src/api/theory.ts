import axios from "axios";

// You can adjust how the token is stored (e.g., cookies, localStorage)
const getToken = () => localStorage.getItem("token");

const API = axios.create({
  baseURL: "http://localhost:5159/api/theory",
});

// Attach Bearer token to every request
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch all chapters
export const getChapters = () => API.get("/chapters");

// Fetch a single chapter (with its sections) by ID
export const getChapterById = (id: string) => API.get(`/chapters/${id}`);
