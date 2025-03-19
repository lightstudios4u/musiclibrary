"use client";

import { useState } from "react";

const MAX_DURATION = 15; // Trim to 15 seconds

async function trimAudio(file: File): Promise<Buffer> {
  // Implement the trimming logic here and return a Buffer
  // For example purposes, returning an empty Buffer
  return Buffer.from([]);
}

export default function AudioUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file");
      return;
    }

    setStatus("Trimming audio...");

    try {
      const trimmedFile = await trimAudio(file);
      const blob = new Blob([trimmedFile], { type: "audio/wav" });

      const formData = new FormData();
      formData.append("file", blob, "recording.wav"); // Appending blob as "file"

      setStatus("Uploading...");
      const res = await fetch("/api/recognize", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Failed to upload: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Recognition result:", data);

      if (!data?.metadata?.music) {
        setStatus("Failed to recognize audio. Please try again.");
        return;
      }

      const songTitle = data.metadata.music[0]?.title || "Unknown";
      setStatus(`Success! Recognized: ${songTitle}`);
    } catch (error) {
      console.error("Error:", error);
      setStatus("Failed to upload");
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Upload
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
}
