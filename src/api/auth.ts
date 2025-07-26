import API from "./base"; // <-- Use shared API instance

export const login = (data: { email: string; password: string }) =>
  API.post("/auth/login", data);

export const register = (data: { email: string; password: string }) =>
  API.post("/auth/register", data);

// a refresh token method (optional, but not used by axios base auto-refresh)
export const refreshToken = (refreshToken: string) =>
  API.post("/auth/refresh", { refreshToken });