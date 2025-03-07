"use client";
import { useEffect } from "react";
import styles from "./page.module.css";
import "./style/main.css";
import FetchedSongs from "./components/FetchedSongs";
import { useSongStore } from "../lib/songStore";

export default function Home() {
  const { fetchSongs, songs } = useSongStore();
  useEffect(() => {
    if (songs.length === 0) fetchSongs();
  }, [songs]);

  return (
    <main className={styles.main}>
      <FetchedSongs />
    </main>
  );
}
