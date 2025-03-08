import { create } from "zustand";
import { useAuthStore } from "./authStore";

interface UserStoreState {
  likedTracks: number[];
  fetchUser: () => Promise<void>;
  likeTrack: (songId: number) => Promise<void>;
  clearUserData: () => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  likedTracks: [],

  fetchUser: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    try {
      const res = await fetch("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Failed to fetch user data:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      console.log(data);
      set({ likedTracks: data.likedTracks || [] });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },

  likeTrack: async (songId) => {
    const token = useAuthStore.getState().token;
    if (!token) {
      alert("You must be logged in to like songs");
      return;
    }

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ songId }),
      });

      if (!res.ok)
        throw new Error(
          `Failed to like track: ${res.status} ${res.statusText}`
        );

      set((state) => ({
        likedTracks: [...state.likedTracks, songId],
      }));
    } catch (error) {
      console.error("Error liking track:", error);
    }
  },

  clearUserData: () => set({ likedTracks: [] }),
}));
