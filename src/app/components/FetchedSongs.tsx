"use client";
import { useEffect, useState } from "react";
import AudioPlayer from "./AudioPlayer";

interface Song {
  id: number;
  title: string;
  artist: string;
  url: string;
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
            {song.title} - {song.artist}
            {/* ✅ Correctly passing only the song.url as a string */}
            <AudioPlayer url={song.url} />
          </li>
        ))}
      </ul>
    </div>
  );
}
