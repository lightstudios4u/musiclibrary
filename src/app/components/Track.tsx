"use client";

import { useState } from "react";
import Player from "./Player";
import Image from "next/image";
import { Song } from "../../lib/types";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { FaSpotify, FaApple, FaYoutube } from "react-icons/fa";
import { useAuthStore } from "@/lib/store/authStore";

interface SongItemProps {
  song: Song;
  onVote: (songId: number, value: number) => void;
  onDelete: (songId: number) => void;
  showVote?: boolean; // Optional prop to control vote visibility
}

export default function Track({
  song,
  onVote,
  onDelete,
  showVote,
}: SongItemProps) {
  const { likeTrack, unlikeTrack, likedTracks } = useAuthStore();
  const [hovered, setHovered] = useState(false);

  const handleLike = () => {
    if (likedTracks.includes(song.id)) {
      unlikeTrack(song.id);
    } else {
      likeTrack(song.id);
    }
  };

  return (
    <div
      key={song.id}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
        borderRadius: "14px",
        backgroundColor: "rgba(130, 130, 130, 0.1)",
        position: "relative",
      }}
    >
      {/* Voting Section */}
      {showVote && (
        <div className="votecontainer">
          <ArrowDropUpIcon
            style={{
              color: "white",
              cursor: "pointer",
              fontSize: "60px",
            }}
            className="upvote"
            onClick={() => onVote(song.id, 1)}
          />
          <p className="votecount">0</p>
          <ArrowDropDownIcon
            style={{
              color: "white",
              cursor: "pointer",
              fontSize: "60px",
            }}
            className="downvote"
            onClick={() => onVote(song.id, -1)}
          />
        </div>
      )}
      {/* Artwork */}
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

      {/* Song Info */}
      <div style={{ fontSize: "16px", width: "100px", textAlign: "center" }}>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <p>{song.title}</p>
          <p style={{ color: "#ffb300" }}>{song.artist}</p>
          <div>
            <p style={{ color: "grey" }}>Added on:</p>
            <p style={{ color: "grey" }}>
              {new Date(song.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <Player url={song.url} />

      {/* Song Details */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap", // ✅ Added back to match original
          gap: "1rem",
          width: "120px",
          fontSize: "14px",
        }}
      >
        <p>
          <strong style={{ color: "grey" }}>Tempo</strong>
          <br /> {song.tempo}
        </p>
        <p>
          <strong style={{ color: "grey" }}>Key</strong>
          <br /> {song.song_key}
        </p>
        <p>
          <strong style={{ color: "grey" }}>Genres</strong>
          <br /> {song.genres}
        </p>
      </div>
      {/* Like, Playlist, and Download */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "30px",
        }}
      >
        <a
          onClick={handleLike}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {likedTracks.includes(song.id) || hovered ? (
            <FavoriteIcon style={{ color: "red" }} />
          ) : (
            <FavoriteBorderIcon />
          )}
        </a>
        <PlaylistAddIcon />
        <DownloadIcon />
      </div>

      {/* Streaming Links */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          position: "absolute",
          right: "22%",
          bottom: "10px",
        }}
      >
        {song.spotify_url && (
          <a href={song.spotify_url}>
            <FaSpotify />
          </a>
        )}
        {song.apple_url && (
          <a href={song.apple_url}>
            <FaApple />
          </a>
        )}
        {song.youtube_url && (
          <a href={song.youtube_url}>
            <FaYoutube />
          </a>
        )}

        {/* Delete Button */}
        <button onClick={() => onDelete(song.id)}>❌ Delete</button>
      </div>
    </div>
  );
}
