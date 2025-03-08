import { create } from "zustand";
import { useUserStore } from "./userStore";
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
  verifyToken: (token: string) => Promise<User | null>; // New function to verify token
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
      if (!res.ok) return data.error || "Registration failed.";

      return null;
    } catch (error) {
      console.error("Registration Error:", error);
      return "Registration failed.";
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
      if (!res.ok) return data.error || "Login failed.";

      set({ token: data.token, user: data.user, isLoggedIn: true });
      return null;
    } catch (error) {
      console.error("Login Error:", error);
      return "Login failed.";
    }
  },

  logout: () => {
    set({ token: null, user: null, isLoggedIn: false });
    useUserStore.getState().clearUserData(); // Clear user data on logout.
  },

  verifyToken: async (token) => {
    try {
      const res = await fetch("/api/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        return null; // Token invalid
      }

      const user: User = await res.json();
      set({ user: user, token: token, isLoggedIn: true });
      return user;
    } catch (error) {
      console.error("Token verification error:", error);
      return null;
    }
  },
}));

import { useEffect } from "react";

export function useSyncAuth() {
  const { verifyToken } = useAuthStore();

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (token) {
      verifyToken(token); // Verify token against backend
    }
  }, [verifyToken]);
}
