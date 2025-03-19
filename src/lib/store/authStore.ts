import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthState {
  isLoading: boolean;
  token: string | null;
  user: User | null;
  likedTracks: number[];
  bio: string | null;
  isLoggedIn: boolean;
  profile_image: string | null;
  setUser: (
    user: User | null,
    likedTracks?: number[],
    profile_image?: string
  ) => void;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  verifyToken: () => Promise<User | null>;
  likeTrack: (songId: number) => Promise<void>;
  unlikeTrack: (songId: number) => Promise<void>;
  setBio: (newBio: string) => void;
  updateUser: (
    updates: Partial<{ bio: string; profile_image: string }>
  ) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      likedTracks: [],
      isLoggedIn: false,
      isLoading: true,
      profile_image: null,
      score: 0,
      bio: null,
      updateUser: async (updates) => {
        try {
          const res = await fetch("/api/updateUser", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
            credentials: "include",
          });

          if (!res.ok) throw new Error("Failed to update user");

          const updatedUser = await res.json();
          set({
            user: updatedUser,
            bio: updatedUser.bio,
            profile_image: updatedUser.profile_image,
          });
        } catch (error) {
          console.error("Update user error:", error);
        }
      },

      setBio: (newBio: string) => set({ bio: newBio }),

      setUser: (user, likedTracks = [], profile_image = "") =>
        set(() => ({
          user,
          likedTracks,
          isLoggedIn: !!user,
          isLoading: false,
          profile_image: profile_image,
        })),

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
            credentials: "include",
          });

          const data = await res.json();
          if (!res.ok) return data.error || "Login failed.";

          const likedTracks = data.user.likedTracks
            ? data.user.likedTracks.split(",").map(Number)
            : [];

          set({
            user: {
              id: data.user.id,
              username: data.user.username,
              email: data.user.email,
            },
            likedTracks: likedTracks,
            isLoggedIn: true,
            isLoading: false,
            profile_image: data.user.profile_image || "/imgs/landingimg.png",
            bio: data.user.bio || null,
          });
          console.log(likedTracks);
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
              "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

            set({
              token: null,
              user: null,
              likedTracks: [],
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

      verifyToken: async () => {
        try {
          const res = await fetch("/api/verify", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (!res.ok) {
            set({ isLoggedIn: false, isLoading: false });
            return null;
          }

          const user = await res.json();

          // ✅ Parse liked tracks from comma-separated string
          const likedTracks = user.liked_songs
            ? user.liked_songs.split(",").map(Number)
            : [];

          set({
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
            },
            likedTracks,
            isLoggedIn: true,
            isLoading: false,
          });

          return user;
        } catch (error) {
          console.error("Token verification error:", error);
          set({ isLoggedIn: false, isLoading: false });
          return null;
        }
      },

      likeTrack: async (songId) => {
        try {
          const res = await fetch("/api/like", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ songId }),
          });

          if (!res.ok) {
            throw new Error(`Failed to like track: ${res.statusText}`);
          }
          set((state) => ({
            likedTracks: state.likedTracks.includes(songId)
              ? state.likedTracks // ✅ If songId already exists, don't add it
              : [...state.likedTracks, songId],
          }));

          console.log(`✅ Track ${songId} liked`);
        } catch (error) {
          console.error("❌ Error liking track:", error);
        }
      },

      unlikeTrack: async (songId) => {
        try {
          const res = await fetch("/api/like/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ songId }),
          });

          if (!res.ok) {
            throw new Error(`Failed to unlike track: ${res.statusText}`);
          }

          set((state) => ({
            likedTracks: state.likedTracks.filter((id) => id !== songId),
          }));

          console.log(`✅ Track ${songId} unliked`);
        } catch (error) {
          console.error("❌ Error unliking track:", error);
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        likedTracks: state.likedTracks, // ✅ Persist likedTracks
        isLoggedIn: state.isLoggedIn,
        profile_image: state.profile_image, // ✅ Add profile_image to persisted state
        bio: state.bio, // ✅ Add bio to persisted state
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // ✅ Set loading state to false after rehydration is done
          state.isLoading = false;
        }
      },
    }
  )
);
