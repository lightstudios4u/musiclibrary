"use client";
import jwt from "jsonwebtoken";

import { useEffect } from "react";
import styles from "./page.module.css";
import "./style/main.css";
import FetchedSongs from "./components/FetchedSongs";
import { useSongStore } from "../lib/store/songStore";
import { useAuthStore } from "@/lib/store/authStore";

export default function Home() {
  const { isLoading } = useAuthStore();

  const { fetchSongs, songs } = useSongStore();
  useEffect(() => {
    if (songs.length === 0) fetchSongs();
  }, [songs]);

  return (
    <main className={styles.main}>
      {isLoading ? <p>Loading...</p> : <FetchedSongs />}
    </main>
  );
}
