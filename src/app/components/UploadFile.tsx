"use client";
import { useState, useRef } from "react";
import { genres } from "../../lib/metadata"; // Import the genres array
import { BeatLoader } from "react-spinners";

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

    try {
      const res = await fetch("../api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
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
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h1>Upload a Song</h1>
      <form
        onSubmit={handleUpload}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          type="text"
          placeholder="Song Title"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
        />

        {/* ✅ Searchable Genre Input */}
        <p>Genres:</p>
        <input
          type="text"
          placeholder="Search genres..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Show filtered genres when searching */}
        {search && (
          <ul
            style={{
              border: "1px solid #ddd",
              padding: "5px",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {filteredGenres.map((g) => (
              <li
                key={g}
                onClick={() => addGenre(g)}
                style={{ cursor: "pointer", padding: "5px 10px" }}
              >
                {g}
              </li>
            ))}
          </ul>
        )}

        {/* Show selected genres as pill boxes */}
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
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
              }}
              onClick={() => removeGenre(genre)}
            >
              {genre} ✖
            </span>
          ))}
        </div>

        <p>Tempo</p>
        <input
          type="number"
          placeholder="Tempo"
          value={tempo === 0 ? "" : tempo}
          onChange={(e) => setTempo(parseInt(e.target.value))}
          required
        />

        <p>Key</p>
        <input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          required
        />
        <p>Spotify URL</p>
        <input
          type="text"
          placeholder="Spotify URL"
          value={spotifyUrl}
          onChange={(e) => setSpotifyUrl(e.target.value)}
        />
        <p>YouTube URL</p>
        <input
          type="text"
          placeholder="YouTube URL"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />
        <p>Apple Music URL</p>
        <input
          type="text"
          placeholder="Apple Music URL"
          value={appleUrl}
          onChange={(e) => setAppleUrl(e.target.value)}
        />

        {/* ✅ File Inputs */}

        <p>Song File</p>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          ref={fileInputRef}
        />

        <p>Artwork</p>
        <input
          type="file"
          onChange={(e) => setArtwork(e.target.files?.[0] || null)}
          required
          ref={artworkInputRef}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* ✅ Loading Spinner */}
      {loading && (
        <div style={{ marginTop: "10px" }}>
          <p>Uploading...</p>
          <BeatLoader color="#ffb300" />
        </div>
      )}

      {/* ✅ Success Message */}
      {successMessage && (
        <p
          style={{
            color: successMessage.includes("failed") ? "red" : "green",
            marginTop: "10px",
          }}
        >
          {successMessage}
        </p>
      )}

      {/* {uploadResponse && (
        <div>
          <p>Uploaded Song:</p>
          {songTitle} - {artist} <br />
          <strong>Genres:</strong> {selectedGenres.join(", ")}
        </div>
      )} */}
    </div>
  );
}
