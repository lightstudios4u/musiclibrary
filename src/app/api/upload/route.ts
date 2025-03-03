import { NextRequest, NextResponse } from "next/server";
// import s3 from "../../../lib/storage"; // Ensure correct path
import pool from "../../../lib/db"; // Ensure correct path to your MySQL connection

export async function POST(req: NextRequest) {
  try {
    // Parse FormData request
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const artwork = formData.get("artwork") as File;
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;

    // Validate input
    if (!file || !artwork || !title || !artist) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert files to Buffers
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const artworkBuffer = Buffer.from(await artwork.arrayBuffer());

    // Upload song file to DigitalOcean Spaces
    const songParams = {
      Bucket: process.env.STORAGE_BUCKET!,
      Key: `songs/${file.name}`, // Store songs in "songs/" folder
      Body: fileBuffer,
      ACL: "public-read",
    };

    // const songUploadResult = await s3.upload(songParams).promise();
    const songUrl = `https://${
      process.env.STORAGE_BUCKET
    }.${process.env.STORAGE_ENDPOINT!.replace("https://", "")}/${
      songParams.Key
    }`;

    // Upload artwork file to DigitalOcean Spaces
    const artworkParams = {
      Bucket: process.env.STORAGE_BUCKET!,
      Key: `artwork/${artwork.name}`, // Store artwork in "artwork/" folder
      Body: artworkBuffer,
      ACL: "public-read",
    };

    // const artworkUploadResult = await s3.upload(artworkParams).promise();
    const artworkUrl = `https://${
      process.env.STORAGE_BUCKET
    }.${process.env.STORAGE_ENDPOINT!.replace("https://", "")}/${
      artworkParams.Key
    }`;

    // Insert song metadata into MySQL database
    await pool.query(
      "INSERT INTO songs (title, artist, url, artwork_url) VALUES (?, ?, ?, ?)",
      [title, artist, songUrl, artworkUrl]
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
