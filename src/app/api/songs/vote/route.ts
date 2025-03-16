import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET!;

export async function PATCH(req: NextRequest) {
  try {
    // ✅ Verify token from cookie
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET_KEY) as { user_id: number };

    const { songId, direction } = await req.json();

    if (!songId || !["up", "down"].includes(direction)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    console.log(
      `✅ ${direction === "up" ? "Upvoting" : "Downvoting"} song ${songId}`
    );

    // ✅ Update score based on direction
    const increment = direction === "up" ? 1 : -1;

    const [result]: any = await pool.query(
      `UPDATE songs 
       SET score = score + ?
       WHERE id = ?`,
      [increment, songId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // ✅ Return the updated score
    const [updatedSong]: any = await pool.query(
      `SELECT score FROM songs WHERE id = ?`,
      [songId]
    );

    console.log(`✅ New score for song ${songId}: ${updatedSong[0].score}`);

    return NextResponse.json({ score: updatedSong[0].score }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating score:", error);
    return NextResponse.json(
      { error: "Failed to update score" },
      { status: 500 }
    );
  }
}
