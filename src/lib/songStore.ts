import { create } from "zustand";
import { Song } from "./types";

interface SongState {
  songs: Song[];
  fetchSongs: () => Promise<void>;
  vote: (song_id: number, vote: number) => void;
  deleteSong: (song_id: number) => Promise<void>; // ✅ Add delete function
}

export const useSongStore = create<SongState>((set) => ({
  songs: [],

  fetchSongs: async () => {
    try {
      const res = await fetch("/api/songs");
      const data = await res.json();
      set({ songs: data });
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  },

  vote: async (song_id, vote) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to vote");
        return;
      }

      await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ song_id, vote }),
      });

      // ✅ Optimistically update score
      set((state) => ({
        songs: state.songs.map((song) =>
          song.id === song_id ? { ...song, score: song.score + vote } : song
        ),
      }));
    } catch (error) {
      console.error("Error voting:", error);
    }
  },

  deleteSong: async (song_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete songs");
        return;
      }

      const res = await fetch(`/api/songs/${song_id}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete song");
      }

      // ✅ Remove the deleted song from Zustand state
      set((state) => ({
        songs: state.songs.filter((song) => song.id !== song_id),
      }));
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  },
}));
