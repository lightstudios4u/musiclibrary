"use client";

import { Song } from "@/lib/types";
import Track from "./Track";

interface TrackListProps {
  tracks: Song[];
  onVote: (songId: number, value: number) => void;
  onDelete: (songId: number) => void;
  userId?: number;
  showVote?: boolean; // Optional prop to control vote visibility
}

export default function TrackList({
  tracks,
  onVote,
  onDelete,
  userId,
  showVote, // Default to true if not provided
}: TrackListProps) {
  return (
    <div
      style={{
        height: "fit-content",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <ul
        style={{
          maxWidth: "1000px",
          display: "flex",
          flexDirection: "column",
          gap: "10px", // ✅ Add gap for consistent spacing
          padding: 0,
          margin: 0,
          listStyle: "none",
        }}
      >
        {tracks.map((track) => (
          <li
            key={track.id}
            style={{
              marginBottom: "1rem", // ✅ Ensure margin is consistent
              padding: "0",
              borderRadius: "14px",
            }}
          >
            <Track
              song={track}
              onVote={(songId, value) => onVote(songId, value)}
              onDelete={(songId) => onDelete(songId)}
              showVote={showVote} // Pass the showVote prop to Track component
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
