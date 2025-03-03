"use client";
import { useEffect, useState } from "react";

interface Song {
  id: number;
  title: string;
  artist: string;
}

export default function FetchedSongs() {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((error) => console.error("Error fetching songs:", error));
  }, []);

  return (
    <div>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            {song.title}
            {song.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}
