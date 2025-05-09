export interface Song {
  id: number;
  title: string;
  artist: string;
  url: string;
  created_at: Date;
  artwork_url: string;
  genres: string;
  tempo: number;
  song_key: string;
  spotify_url: string;
  youtube_url: string;
  apple_url: string;
  score: number;
  artist_id: number;
}

export interface SongState {
  songs: Song[];
  fetchSongs: () => Promise<void>;
  vote: (song_id: number, vote: number) => void;
}

export interface UploadResponse {
  songUrl: string;
  artworkUrl: string;
}

export interface UploadFormData {
  file: File;
  artwork: File;
  title: string;
  artist: string;
  genres: string[];
  tempo: number;
  key: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  token: string | null;
  likedTracks: number[];
  profile_image: string | null;
  bio: string | null;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  author?: string;
  publication_date: string;
  category?: string;
  tags?: string[];
  image_url?: string;
  status?: "draft" | "published";
  created_at: Date;
}
