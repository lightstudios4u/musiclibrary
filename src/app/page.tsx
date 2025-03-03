import styles from "./page.module.css";
import FetchedSongs from "./components/FetchedSongs";
import UploadPage from "./components/UploadFile";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Music Library</h1>
        <FetchedSongs />
        <UploadPage />
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
