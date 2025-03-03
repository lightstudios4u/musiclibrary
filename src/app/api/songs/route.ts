import { NextResponse } from "next/server";
import pool from "../../../lib/db";
import { RowDataPacket } from "mysql2";

interface Song {
  id: number;
  title: string;
  artist: string;
}

// ✅ GET handler for fetching songs
export async function GET() {
  try {
    console.log("Fetching songs from database...");
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM songs");

    // Ensure TypeScript recognizes this as Song[]
    const songs: Song[] = rows as Song[];

    return NextResponse.json(songs, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }
}
