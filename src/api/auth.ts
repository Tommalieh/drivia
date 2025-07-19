import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5159/api/auth",
});

export const login = (data: { email: string; password: string }) => API.post("/login", data);
export const register = (data: { email: string; password: string }) => API.post("/register", data);
