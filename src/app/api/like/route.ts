import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "../../../lib/db";

const SECRET_KEY = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    console.log("🔎 Verifying token...");

    // ✅ Get token from secure cookie (instead of Authorization header)
    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.warn("❌ No token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY) as { user_id: number };
    } catch (err) {
      console.error("❌ Token verification failed:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.log("✅ Token verified:", decoded);

    // ✅ Get user ID from token
    const userId = decoded.user_id;

    // ✅ Extract songId from request body
    const { songId } = await req.json();
    if (!songId) {
      return NextResponse.json({ error: "Missing songId" }, { status: 400 });
    }

    console.log(`✅ Liking songId: ${songId} for userId: ${userId}`);

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

    console.log(`✅ Track ${songId} liked by user ${userId}`);

    return NextResponse.json({ message: "Track liked" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error liking track:", error);
    return NextResponse.json(
      { error: "Failed to like track" },
      { status: 500 }
    );
  }
}
