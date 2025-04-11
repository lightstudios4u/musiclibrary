"use client";

import { Song } from "@/lib/types";
import Track from "./Track";
import "../style/main.css";

interface TrackListProps {
  tracks: Song[];
  onVote: (songId: number, value: number) => void;
  onDelete: (songId: number) => void;
  userId?: number;
  showVote?: boolean; // Optional prop to control vote visibility
  showSave?: boolean; // Optional prop to control save visibility
}

export default function TrackList({
  tracks,
  onVote,
  onDelete,
  userId,
  showVote, // Default to true if not provided
  showSave, // Default to true if not provided
}: TrackListProps) {
  return (
    <div className="tracklistwrapper">
      <ul className="tracklist">
        {tracks.map((track) => (
          <li key={track.id} className="tracklistitem">
            <Track
              song={track}
              onVote={(songId, value) => onVote(songId, value)}
              onDelete={(songId) => onDelete(songId)}
              showVote={showVote} // Pass the showVote prop to Track component
              showSave={showSave} // Show save button by default
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
