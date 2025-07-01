import { apiRequest } from "./queryClient";

export interface User {
  id: number;
  email: string;
  name: string;
  credits: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const auth = {
  signup: async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    const response = await apiRequest("POST", "/api/auth/signup", data);
    const authData = await response.json();
    localStorage.setItem("token", authData.token);
    return authData;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await apiRequest("POST", "/api/auth/login", data);
    const authData = await response.json();
    localStorage.setItem("token", authData.token);
    return authData;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem("token");
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch {
      localStorage.removeItem("token");
      return null;
    }
  },
};
