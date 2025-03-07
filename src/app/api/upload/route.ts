import { NextRequest, NextResponse } from "next/server";
import s3 from "../../../lib/storage"; // ✅ Ensure this import is correct
import pool from "../../../lib/db"; // ✅ Ensure correct MySQL connection

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const artwork = formData.get("artwork") as File;
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;
    const genres = formData.get("genres") as string;
    const tempo = formData.get("tempo") as string;
    const key = formData.get("key") as string;
    const spotifyUrl = formData.get("spotifyUrl") as string;
    const youtubeUrl = formData.get("youtubeUrl") as string;
    const appleUrl = formData.get("appleUrl") as string;
    const user_id = formData.get("user_id") as string;

    //Check if artist exists
    const [existingArtists] = await pool.query<any[]>(
      "SELECT id FROM artists WHERE name = ?",
      [artist]
    );

    let artist_id;
    if (existingArtists.length > 0) {
      artist_id = existingArtists[0].id;
    } else {
      // ✅ Insert new artist
      const [artistResult] = await pool.query(
        "INSERT INTO artists (name) VALUES (?)",
        [artist]
      );
      artist_id = (artistResult as any).insertId;
    }
    // ✅ Validate input
    if (!file || !artwork || !title || !artist) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Convert files to Buffers
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const artworkBuffer = Buffer.from(await artwork.arrayBuffer());

    // ✅ Upload song file to DigitalOcean Spaces
    const songParams = {
      Bucket: process.env.STORAGE_BUCKET!,
      Key: `songs/${file.name}`, // Use timestamp to prevent overwrites
      Body: fileBuffer,
      ACL: "public-read",
    };

    const songUploadResult = await s3.upload(songParams).promise();
    const songUrl = songUploadResult.Location; // ✅ Get actual uploaded file URL
    console.log(songUrl);
    // ✅ Upload artwork file to DigitalOcean Spaces
    const artworkParams = {
      Bucket: process.env.STORAGE_BUCKET!,
      Key: `artwork/${Date.now()}-${artwork.name}`, // Use timestamp to prevent overwrites
      Body: artworkBuffer,
      ACL: "public-read",
    };

    const artworkUploadResult = await s3.upload(artworkParams).promise();
    const artworkUrl = artworkUploadResult.Location; // ✅ Get actual uploaded file URL

    // ✅ Insert song metadata into MySQL database
    await pool.query(
      "INSERT INTO songs (title, artist, url, artwork_url, genres, tempo, song_key, spotify_url, apple_url, youtube_url, artist_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        artist,
        songUrl,
        artworkUrl,
        genres,
        tempo,
        key,
        spotifyUrl,
        appleUrl,
        youtubeUrl,
        artist_id,
        user_id,
      ]
    );

    return NextResponse.json(
      { message: "File uploaded successfully", songUrl, artworkUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
