"use client";
import { useState, useRef } from "react";
import { genres } from "../../lib/metadata"; // Import the genres array
import { BeatLoader } from "react-spinners";
import { useAuthStore } from "@/lib/store/authStore";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [artwork, setArtwork] = useState<File | null>(null);
  const [songTitle, setSongTitle] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [tempo, setTempo] = useState<number>(0);
  const [key, setKey] = useState<string>("");
  const [search, setSearch] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [appleUrl, setAppleUrl] = useState("");
  const { user } = useAuthStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const artworkInputRef = useRef<HTMLInputElement>(null);

  //   const [uploadResponse, setUploadResponse] = useState<{
  //     songUrl: string;
  //     artworkUrl: string;
  //   } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Filter genres based on search input
  const filteredGenres = genres.filter((genre) =>
    genre.toLowerCase().includes(search.toLowerCase())
  );

  // Add a genre when clicked
  const addGenre = (genre: string) => {
    if (!selectedGenres.includes(genre)) {
      setSelectedGenres([...selectedGenres, genre]);
    }
    setSearch(""); // Clear search after selecting
  };

  // Remove a genre from the selected list
  const removeGenre = (genre: string) => {
    setSelectedGenres(selectedGenres.filter((g) => g !== genre));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !file ||
      !artwork ||
      !songTitle ||
      !artist ||
      selectedGenres.length === 0 ||
      !key ||
      tempo <= 0 ||
      !spotifyUrl ||
      !youtubeUrl ||
      !appleUrl
    ) {
      alert("Please fill out all fields and select at least one genre.");
      return;
    }

    setLoading(true); // ✅ Show loading spinner

    const formData = new FormData();
    formData.append("file", file);
    formData.append("artwork", artwork);
    formData.append("title", songTitle);
    formData.append("artist", artist);
    formData.append("genres", selectedGenres.join(", ")); // ✅ Store genres as a comma-separated string
    formData.append("tempo", tempo.toString());
    formData.append("key", key);
    formData.append("spotifyUrl", spotifyUrl);
    formData.append("youtubeUrl", youtubeUrl);
    formData.append("appleUrl", appleUrl);
    formData.append("user_id", user ? user.id.toString() : "");

    try {
      await fetch("../api/upload", {
        method: "POST",
        body: formData,
      });

      //   const data = await res.json();
      //   setUploadResponse(data);
      setSuccessMessage("🎉 Upload Successful!"); // ✅ Show success message

      // ✅ Clear inputs after upload
      setFile(null);
      setArtwork(null);
      setSongTitle("");
      setArtist("");
      setSelectedGenres([]);
      setTempo(0);
      setKey("");
      setSearch("");
      setSpotifyUrl("");
      setYoutubeUrl("");
      setAppleUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (artworkInputRef.current) artworkInputRef.current.value = "";
    } catch (error) {
      console.error("Error uploading file:", error);
      setSuccessMessage("❌ Upload failed. Please try again.");
    } finally {
      setLoading(false); // ✅ Hide loading spinner
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#111", // Deep black background
        color: "white", // White text for contrast
      }}
    >
      <h1
        style={{ textAlign: "center", marginBottom: "20px", color: "#ffb300" }}
      >
        Upload a Song
      </h1>

      <form
        onSubmit={handleUpload}
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        {/* 🔹 Basic Information */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px",
            backgroundColor: "#222",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ color: "#ffb300" }}>Song Information</h3>
          <label>Title</label>
          <input
            type="text"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            required
            style={{
              padding: "8px",
              backgroundColor: "#333",
              color: "white",
              border: "1px solid #444",
              borderRadius: "5px",
            }}
            placeholder="Enter song title"
          />

          <label>Artist</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
            style={{
              padding: "8px",
              backgroundColor: "#333",
              color: "white",
              border: "1px solid #444",
              borderRadius: "5px",
            }}
            placeholder="Enter artist name"
          />
        </div>

        {/* 🔹 Genres Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px",
            backgroundColor: "#222",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ color: "#ffb300" }}>Genres</h3>
          <input
            type="text"
            placeholder="Search genres..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#333",
              color: "white",
              border: "1px solid #444",
              borderRadius: "5px",
            }}
          />

          {/* Show filtered genres when searching */}
          {search && (
            <ul
              style={{
                border: "1px solid #555",
                padding: "5px",
                maxHeight: "150px",
                overflowY: "auto",
                backgroundColor: "#222",
                borderRadius: "5px",
              }}
            >
              {filteredGenres.map((g) => (
                <li
                  key={g}
                  onClick={() => addGenre(g)}
                  style={{
                    cursor: "pointer",
                    padding: "5px 10px",
                    borderBottom: "1px solid #333",
                  }}
                >
                  {g}
                </li>
              ))}
            </ul>
          )}

          {/* Selected Genres */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "5px",
              marginTop: "10px",
            }}
          >
            {selectedGenres.map((genre) => (
              <span
                key={genre}
                style={{
                  backgroundColor: "#ffb300",
                  padding: "5px 10px",
                  borderRadius: "15px",
                  cursor: "pointer",
                  color: "black",
                  fontWeight: "bold",
                }}
                onClick={() => removeGenre(genre)}
              >
                {genre} ✖
              </span>
            ))}
          </div>
        </div>

        {/* 🔹 Song Details */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px",
            backgroundColor: "#222",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ color: "#ffb300" }}>Song Details</h3>
          <label>Tempo</label>
          <input
            type="number"
            value={tempo === 0 ? "" : tempo}
            onChange={(e) => setTempo(parseInt(e.target.value))}
            required
            style={{
              padding: "8px",
              backgroundColor: "#333",
              color: "white",
              border: "1px solid #444",
              borderRadius: "5px",
            }}
          />

          <label>Key</label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
            style={{
              padding: "8px",
              backgroundColor: "#333",
              color: "white",
              border: "1px solid #444",
              borderRadius: "5px",
            }}
          />
        </div>

        {/* 🔹 Streaming Links */}
        <div
          style={{
            padding: "10px",
            backgroundColor: "#222",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ color: "#ffb300" }}>Streaming Links (Optional)</h3>
          <label>Spotify URL</label>
          <input
            type="text"
            value={spotifyUrl}
            onChange={(e) => setSpotifyUrl(e.target.value)}
          />

          <label>YouTube URL</label>
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />

          <label>Apple Music URL</label>
          <input
            type="text"
            value={appleUrl}
            onChange={(e) => setAppleUrl(e.target.value)}
          />
        </div>

        {/* 🔹 File Uploads */}
        <div
          style={{
            padding: "10px",
            backgroundColor: "#222",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ color: "#ffb300" }}>Upload Files</h3>
          <label>Song File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />

          <label>Artwork</label>
          <input
            type="file"
            onChange={(e) => setArtwork(e.target.files?.[0] || null)}
            required
          />
        </div>

        {/* 🔹 Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#ff6600",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* 🔹 Loading Spinner */}
      {loading && (
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <p>Uploading...</p>
          <BeatLoader color="#ffb300" />
        </div>
      )}

      {/* 🔹 Success Message */}
      {successMessage && (
        <p
          style={{
            color: successMessage.includes("failed") ? "red" : "green",
            marginTop: "10px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {successMessage}
        </p>
      )}
    </div>
  );
}
