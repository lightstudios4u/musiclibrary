"use client";
import { useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css"; // Default styling
import "../style/main.css";

interface AudioPlayerProps {
  url: string;
}

export default function Player({ url }: AudioPlayerProps) {
  const [audioSrc] = useState(url);

  return (
    <div style={{ boxShadow: "0 4px 6px rgba(168, 126, 126, 0.1)" }}>
      <AudioPlayer src={audioSrc} autoPlay={false} />
    </div>
  );
}
