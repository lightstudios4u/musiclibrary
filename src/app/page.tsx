"use client";
import { useEffect } from "react";
import styles from "./page.module.css";
import "./style/main.css";
import FetchedSongs from "./components/FetchedSongs";
import { useSongStore } from "../lib/songStore";

export default function Home() {
  const { fetchSongs } = useSongStore();
  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  return (
    <main className={styles.main}>
      <FetchedSongs />
    </main>
  );
}
