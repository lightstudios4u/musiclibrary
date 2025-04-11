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
import CancelIcon from "@mui/icons-material/Cancel";
import { FaSpotify, FaApple, FaYoutube } from "react-icons/fa";
import { useAuthStore } from "@/lib/store/authStore";
import { useNotifyStore } from "@/lib/store/notifyStore";

interface SongItemProps {
  song: Song;
  onVote: (songId: number, value: number) => void;
  onDelete: (songId: number) => void;
  showVote?: boolean;
  showSave?: boolean;
}

export default function Track({
  song,
  onVote,
  onDelete,
  showVote,
  showSave,
}: SongItemProps) {
  const { likeTrack, unlikeTrack, likedTracks } = useAuthStore();
  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingUnlike, setPendingUnlike] = useState<number | null>(null);
  const addNotification = useNotifyStore((state) => state.addNotification);

  const handleLike = () => {
    if (likedTracks.includes(song.id)) {
      setPendingUnlike(song.id);
      setShowModal(true);
    } else {
      likeTrack(song.id);
      addNotification(
        `Added ${song.title} by ${song.artist} to your saved tracks`
      );
    }
  };

  const confirmUnlike = () => {
    if (pendingUnlike !== null) {
      unlikeTrack(pendingUnlike);
      setPendingUnlike(null);

      addNotification(
        `Removed ${song.title} by ${song.artist} from your saved tracks`
      );
      setShowModal(false);
    }
  };

  return (
    <div key={song.id} className="trackcontainer">
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
          flexWrap: "wrap",
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
        {showSave ? (
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
        ) : (
          <CancelIcon
            onClick={() => {
              setPendingUnlike(song.id);
              setShowModal(true);
            }}
            style={{ color: "white", cursor: "pointer" }}
          />
        )}

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

      {/* Confirmation Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "black",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <p>
              Are you sure you want to remove{" "}
              <strong>
                {song.title} by {song.artist}
              </strong>{" "}
              from your saved tracks?
            </p>
            <br />
            <div
              style={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              <button
                onClick={confirmUnlike}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ccc",
                  color: "black",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
