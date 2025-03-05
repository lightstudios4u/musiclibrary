"use client";
import { useState } from "react";
import styles from "./page.module.css";
import "./style/main.css";
import FetchedSongs from "./components/FetchedSongs";
import UploadPage from "./components/UploadFile";

export default function Home() {
  const [refresh, setRefresh] = useState(false);

  return (
    <main className={styles.main}>
      <FetchedSongs />
    </main>
  );
}
