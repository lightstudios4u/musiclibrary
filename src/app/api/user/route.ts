import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";

const SECRET_KEY = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    // ✅ Get token from headers
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header missing" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Token missing" }, { status: 401 });
    }

    // ✅ Verify token and extract user ID
    let userId;
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { user_id: number };
      userId = decoded.user_id;
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // ✅ Fetch user data
    const [userRows]: any = await pool.query(
      `SELECT id, username, email FROM users WHERE id = ?`,
      [userId]
    );

    if (userRows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userRows[0];

    // ✅ Fetch liked tracks
    const [likedTracksRows]: any = await pool.query(
      `SELECT songs.* FROM songs 
       JOIN votes ON songs.id = votes.song_id 
       WHERE votes.user_id = ? AND votes.vote = 1`,
      [userId]
    );

    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      likedTracks: likedTracksRows,
    });
  } catch (error) {
    console.error("Fetch User Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
