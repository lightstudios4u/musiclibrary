import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { songId } = await req.json();
    const decoded: any = jwt.verify(token, SECRET_KEY);
    const userId = decoded.user_id;

    // ✅ Add songId to liked_tracks column (comma-separated list)
    await pool.query(
      `UPDATE users 
      SET liked_songs = 
        IF(
          liked_songs IS NULL OR liked_songs = '', 
          ?, 
          IF(
            FIND_IN_SET(?, liked_songs) = 0, 
            CONCAT(liked_songs, ',', ?), 
            liked_songs
          )
        ) 
      WHERE id = ?`,
      [songId, songId, songId, userId]
    );

    return NextResponse.json({ message: "Track liked" }, { status: 200 });
  } catch (error) {
    console.error("Error liking track:", error);
    return NextResponse.json(
      { error: "Failed to like track" },
      { status: 500 }
    );
  }
}
