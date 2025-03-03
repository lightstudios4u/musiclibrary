"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [artwork, setArtwork] = useState<File | null>(null);

  const [songTitle, setSongTitle] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  //   const [uploadURL, setUploadURL] = useState<string>("");
  const [uploadResponse, setUploadResponse] = useState<{
    songUrl: string;
    artworkUrl: string;
  } | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !artwork || !songTitle || !artist) {
      alert("Please fill out all fields and select files.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("artwork", artwork);

    formData.append("title", songTitle);
    formData.append("artist", artist);

    try {
      const res = await fetch("../api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);
      setUploadResponse(data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <h1>Upload a Song</h1>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Song Title"
          onChange={(e) => setSongTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Artist"
          onChange={(e) => setArtist(e.target.value)}
          required
        />
        <p>song</p>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
        <p>artwork</p>

        <input
          type="file"
          onChange={(e) => setArtwork(e.target.files?.[0] || null)}
          required
        />
        <button type="submit">Upload</button>
      </form>

      {uploadResponse && (
        <div>
          <p>Uploaded Song:</p>
          {songTitle} - {artist}
        </div>
      )}
    </div>
  );
}
