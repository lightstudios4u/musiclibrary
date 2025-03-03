"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadURL, setUploadURL] = useState<string>("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("../api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setUploadURL(data.url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <h1>Upload a Song</h1>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="submit">Upload</button>
      </form>
      {uploadURL && (
        <div>
          <p>Uploaded File:</p>
          <a href={uploadURL} target="_blank" rel="noopener noreferrer">
            {uploadURL}
          </a>
        </div>
      )}
    </div>
  );
}
