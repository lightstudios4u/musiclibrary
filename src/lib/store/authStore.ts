import { create } from "zustand";

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthState {
  isLoading: boolean; // ✅ Start with loading true
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
  isLoading: true, // ✅ Start as true to prevent flashing

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

      set({
        token: data.token,
        user: data.user,
        isLoggedIn: true,
        isLoading: false,
      });

      return null;
    } catch (error) {
      console.error("Login Error:", error);
      return "Login failed.";
    }
  },

  logout: async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });

      if (res.ok) {
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // ✅ Clear token cookie

        set({
          token: null,
          user: null,
          isLoggedIn: false,
          isLoading: false,
        });
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Logout Error:", error);
    }
  },

  verifyToken: async (token) => {
    try {
      const res = await fetch("/api/verify", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include", // ✅ Include cookies in the request
      });
      if (!res.ok) {
        set({ isLoading: false, isLoggedIn: false });
        return null;
      }

      const user: User = await res.json();
      set({
        user: user,
        token: token,
        isLoggedIn: true,
        isLoading: false,
      });

      return user;
    } catch (error) {
      console.error("Token verification error:", error);
      set({ isLoading: false, isLoggedIn: false });
      return null;
    }
  },
}));

// import { useEffect } from "react";

// export function useSyncAuth() {
//   const { verifyToken } = useAuthStore();

//   useEffect(() => {
//     const token = document.cookie.replace(
//       /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
//       "$1"
//     );

//     if (token) {
//       console.log("usesyncauth");
//       verifyToken(token).catch(() => {
//         // ✅ Ensure loading state is updated even if token verification fails
//         useAuthStore.setState({ isLoading: false, isLoggedIn: false });
//       });
//     } else {
//       useAuthStore.setState({ isLoading: false, isLoggedIn: false });
//     }
//   }, [verifyToken]);
// }
