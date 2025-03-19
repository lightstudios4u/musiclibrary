"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../../lib/store/authStore";
import { useSongStore } from "../../lib/store/songStore";
import TrackList from "../components/TrackList";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import { profile } from "console";
import { useNotifyStore } from "@/lib/store/notifyStore";

function Page() {
  const bio = useAuthStore((state) => state.bio);
  const { profile_image, user, isLoading } = useAuthStore();
  const { setUser } = useAuthStore();
  const updateUser = useAuthStore((state) => state.updateUser);
  const [uploadedProfileImage, setUploadedProfileImage] = useState<File | null>(
    null
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [updatingBio, setUpdatingBio] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    profile_image || "/imgs/landingimg.png"
  );
  const [newBio, setNewBio] = useState(bio || "");
  const likedTracks = useAuthStore((state) => state.likedTracks);
  const { songs, fetchSongs, vote, deleteSong } = useSongStore();
  const addNotification = useNotifyStore((state) => state.addNotification);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewBio(e.target.value);
  };

  const handleSaveBio = async () => {
    try {
      await updateUser({ bio: newBio });
      setUpdatingBio(false);
      addNotification("Bio updated successfully!");
    } catch (error) {
      alert("Failed to update bio.");
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const uploadProfileImage = async () => {
    if (!uploadedProfileImage) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_image", uploadedProfileImage);

    try {
      const response = await fetch("/api/updateUser", {
        method: "PATCH",
        body: formData,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log(updatedUser.profile_image);
        setPreviewImage(updatedUser.profile_image || "/imgs/landingimg.png");
        const currentState = useAuthStore.getState();
        setUser(
          currentState.user,
          currentState.likedTracks,
          updatedUser.profile_image || currentState.profile_image
        );
        addNotification("Profile image updated successfully!");
        setUploadingImage(false);
      } else {
        alert("Failed to update profile image.");
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      alert("An error occurred while uploading the image.");
    }
  };
  useEffect(() => {
    console.log("use effect running");
    if (useAuthStore.getState().profile_image) {
      setPreviewImage(profile_image);
    }
    setNewBio(useAuthStore.getState().bio || "");
    console.log(newBio);
    if (songs.length === 0) {
      fetchSongs();
    }
    // fetchSongs();
  }, [isLoading, profile_image, songs, fetchSongs]);

  return (
    <>
      {user ? (
        <div className="profilecontainer">
          <div className="profileheader">
            <h1> {user.username}</h1>
            <div className="profileimg">
              {uploadingImage ? (
                <>
                  <input
                    type="file"
                    onChange={handleProfileImageChange}
                    style={{ marginBottom: "0.5rem" }}
                  />
                  <button
                    className="standardbutton"
                    onClick={uploadProfileImage}
                  >
                    Upload
                  </button>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => setUploadingImage(!uploadingImage)}
                  >
                    Cancel
                    <CancelIcon fontSize="small" />
                  </a>
                </>
              ) : (
                <>
                  <a
                    style={{ cursor: "pointer" }}
                    onClick={() => setUploadingImage(!uploadingImage)}
                  >
                    <EditIcon fontSize="small" />
                  </a>
                  <img
                    src={previewImage || "/imgs/landingimg.png"}
                    alt="Profile Picture"
                    width={100}
                    height={100}
                    style={{
                      objectFit: "cover",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowFullImage(true)} // Show modal on click
                  />
                </>
              )}
            </div>

            <div className="profileheaderitem">
              <p className="mb-2">Email: {user.email}</p>
            </div>
            <div className="profileheaderitem">
              <a
                style={{ cursor: "pointer" }}
                onClick={() => setUpdatingBio(!updatingBio)}
              >
                <EditIcon fontSize="small" />
              </a>
              <p className="mb-2">Bio:</p>
              {!updatingBio && <p>{newBio || "No bio available"}</p>}
            </div>
            {updatingBio && (
              <div className="bioedit">
                <textarea
                  className="w-full p-2 border rounded-md"
                  placeholder="Write something about yourself..."
                  style={{ height: "100px", width: "50%" }}
                  onChange={handleBioChange}
                />
                <button className="standardbutton" onClick={handleSaveBio}>
                  Save
                </button>
                <CancelIcon
                  fontSize="small"
                  onClick={() => setUpdatingBio(!updatingBio)}
                />
              </div>
            )}
          </div>

          {likedTracks.length > 0 ? (
            <div className="tracklistcontainer">
              <h2 className="text-xl font-semibold mb-2">Saved Tracks:</h2>
              <TrackList
                tracks={songs.filter((song) => likedTracks.includes(song.id))}
                onVote={(songId, value) =>
                  vote(songId, user?.id as number, value)
                }
                onDelete={(songId) => deleteSong(songId)}
                userId={user?.id as number}
                showVote={false}
                showSave={false} // Show save button by default
              />
            </div>
          ) : (
            <p>No liked tracks yet.</p>
          )}
        </div>
      ) : (
        <p>Please log in to see your profile.</p>
      )}

      {/* Modal for enlarged profile image */}
      {showFullImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowFullImage(false)}
        >
          <img
            src={previewImage || "/imgs/landingimg.png"}
            alt="Enlarged Profile"
            style={{
              maxWidth: "80%",
              maxHeight: "80%",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </div>
      )}
    </>
  );
}

export default Page;
