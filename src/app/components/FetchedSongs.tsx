"use client";
import { useState } from "react";
import Player from "./Player";
import Image from "next/image";
import { Song } from "@/lib/types";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import DownloadIcon from "@mui/icons-material/Download";
import "../style/main.css";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { FaSpotify } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import CampaignIcon from "@mui/icons-material/Campaign";
import { useSongStore } from "../../lib/store/songStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useUserStore } from "@/lib/store/userStore";

import { useRouter } from "next/navigation";

export default function FetchedSongs() {
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [songIdToDelete, setSongIdToDelete] = useState<number | null>(null);
  const { songs, deleteSong, vote } = useSongStore();
  const { user, isLoggedIn } = useAuthStore();
  const { likedTracks, likeTrack } = useUserStore();

  const router = useRouter();

  return (
    <div className="maincontainer">
      {showModal && initialLoad && !isLoggedIn && (
        <div className="modalcontainer">
          <div className="modal">
            <h1>Welcome to the Indie Share!</h1>
            <div>
              <div
                style={{
                  color: "orange",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Get your music heard
                <CampaignIcon style={{ marginLeft: "7px" }} />
              </div>
              <br />
              <br />
              - Upload your music
              <br />
              - Browse through the library
              <br />
              - Vote on what you hear
              <br />
              - Add songs to custom playlists
              <br />- Share with your friends
            </div>
            <br />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <button
                className="standardbutton "
                onClick={() => router.push("/login")}
              >
                Login
              </button>
              <button
                className="standardbutton altbutton"
                onClick={() => router.push("/signup")}
              >
                Create Account
              </button>
              <a
                style={{ cursor: "pointer" }}
                onClick={() => setShowModal(false)}
              >
                Continue
              </a>
            </div>
          </div>
        </div>
      )}
      {showModal && !initialLoad && (
        <div className="modalcontainer">
          <div className="modal">
            <h1>Just checking</h1>
            <p>Are you sure you want to delete this song?</p>
            <br />
            <button
              className="standardbutton deletebutton"
              onClick={() => setShowModal(false)}
            >
              Delete
            </button>
            <button
              className="standardbutton cancelbutton"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          margin: "2rem",
          height: "80vh",
          width: "70%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <ul style={{ maxWidth: "1000px" }}>
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
                position: "relative",
              }}
            >
              <div className="votecontainer">
                <ArrowDropUpIcon
                  style={{
                    color: "white",
                    cursor: "pointer",
                    fontSize: "60px",
                  }}
                  className="upvote"
                  onClick={() => vote(song.id, user?.id as number, 1)}
                />
                <p className="votecount">0</p>
                <ArrowDropDownIcon
                  style={{
                    color: "white",
                    cursor: "pointer",
                    fontSize: "60px",
                  }}
                  className="downvote"
                  onClick={() => vote(song.id, user?.id as number, -1)}
                />
              </div>

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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <p style={{ textShadow: "0px 4px 6px rgba(0,0,0,.01)" }}>
                    {song.title}
                  </p>
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

              {/* ✅ Correctly passing only the song.url as a string */}
              <Player url={song.url} />
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
                  <br></br> {song.tempo}
                </p>
                <p>
                  <strong style={{ color: "grey" }}>Key</strong>
                  <br></br> {song.song_key}
                </p>
                <p>
                  <strong style={{ color: "grey" }}>Genres</strong>
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
                <a onClick={() => likeTrack(song.id)}>
                  <FavoriteBorderIcon />
                </a>
                <PlaylistAddIcon />
                <DownloadIcon />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "1rem",
                  width: "fit-content",
                  fontSize: "18px",
                  position: "absolute",
                  right: "22%",
                  bottom: "10px",
                }}
              >
                <FaSpotify />
                <FaApple />
                <FaYoutube />
                <button onClick={() => deleteSong(song.id)}>❌ Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
