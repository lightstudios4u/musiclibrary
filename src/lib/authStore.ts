import { create } from "zustand";

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoggedIn: false,

  register: async (email, username, password) => {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();
      if (!res.ok) return data.error; // Return error message

      return null; // ✅ No error, registration successful
    } catch (error) {
      console.error("Registration Error:", error);
      return "Registration failed";
    }
  },

  login: async (email, password) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return data.error; // Return error message

      localStorage.setItem("token", data.token); // ✅ Store token in localStorage

      set({ token: data.token, user: data.user, isLoggedIn: true });
      return null; // ✅ No error, login successful
    } catch (error) {
      console.error("Login Error:", error);
      return "Login failed";
    }
  },

  logout: () => {
    localStorage.removeItem("token"); // ✅ Clear token
    set({ token: null, user: null, isLoggedIn: false });
  },
}));
