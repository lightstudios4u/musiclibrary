"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSongStore } from "../../lib/store/songStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import TrackList from "./TrackList";

export default function FetchedSongs() {
  const [showModal, setShowModal] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const { songs, deleteSong, vote } = useSongStore();
  const { user, isLoggedIn, likeTrack, unlikeTrack } = useAuthStore();
  const likedTracks = useAuthStore((state) => state.likedTracks);

  const router = useRouter();
  const landingimgsrc = "/imgs/landingimg.webp";

  const handleLike = (songId: number) => {
    try {
      if (likedTracks.includes(songId)) {
        unlikeTrack(songId);
      } else {
        console.log("liked tracks" + likedTracks);
        likeTrack(songId);
      }
    } catch (error) {
      console.error("Failed to like track:", error);
      alert("Failed to like track. Please try again.");
    }
  };

  return (
    <div className="tracklistcontainer">
      {/* ✅ First Modal */}
      {showModal && initialLoad && !isLoggedIn && (
        <div className="modalcontainer">
          <div className="modal">
            <div>
              <Image
                alt="Indie Share"
                src={landingimgsrc}
                width={900}
                height={506}
                style={{
                  width: "100%",
                  height: "auto ",
                  borderRadius: "4px",
                }}
              />
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
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <button
                className="standardbutton"
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

      {/* ✅ Second Modal */}
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

      {/* ✅ Track List */}
      <TrackList
        tracks={songs}
        onVote={(songId, value) => vote(songId, user?.id as number, value)}
        onDelete={(songId) => deleteSong(songId)}
        showVote={true} // Show vote buttons
      />
    </div>
  );
}
