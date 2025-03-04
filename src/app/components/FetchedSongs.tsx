"use client";
import { useEffect, useState } from "react";
import Player from "./Player";
import Image from "next/image";
import { Song } from "../api/songs/route";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import DownloadIcon from "@mui/icons-material/Download";

export default function FetchedSongs({ refresh }: { refresh: boolean }) {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchSongs = () => {
      fetch("/api/songs")
        .then((res) => res.json())
        .then((data) => setSongs(data))
        .catch((error) => console.error("Error fetching songs:", error));
    };

    fetchSongs(); // Initial fetch
  }, [refresh]);

  return (
    <div
      style={{
        margin: "2rem",
        height: "80vh",
        width: "70%",
        overflowY: "scroll",
      }}
    >
      <ul>
        {songs.map((song) => (
          <li
            key={song.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
              borderRadius: "14px",
              backgroundColor: "rgba(130, 130, 130, 0.1)",
            }}
          >
            <Image
              src={song.artwork_url}
              alt="Artwork"
              width={100}
              height={100}
              style={{
                borderRadius: "4px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
            <div
              style={{
                fontSize: "16px",
                width: "100px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p style={{ textShadow: "0px 4px 6px rgba(0,0,0,.01)" }}>
                {song.title}
              </p>
              <p style={{ color: "#ffb300" }}>{song.artist}</p>
            </div>

            {/* ✅ Correctly passing only the song.url as a string */}
            <Player url={song.url} />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "1rem",
                width: "200px",
                fontSize: "13px",
              }}
            >
              <p>
                <strong>Tempo</strong>
                <br></br> {song.tempo}
              </p>
              <p>
                <strong>Key</strong>
                <br></br> {song.song_key}
              </p>
              <p>
                <strong>Genres</strong>
                <br></br> {song.genres}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                gap: "1rem",
                width: "30px",
                fontSize: "13px",
              }}
            >
              <FavoriteBorderIcon />
              <PlaylistAddIcon />
              <DownloadIcon />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
