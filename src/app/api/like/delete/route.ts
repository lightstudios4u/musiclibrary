import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "../../../../lib/db";

const SECRET_KEY = process.env.JWT_SECRET!;

export async function DELETE(req: NextRequest) {
  // ✅ Changed from POST to DELETE
  try {
    console.log("🔎 Verifying token...");

    // ✅ Get token from secure cookie
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

    console.log(`✅ Unliking songId: ${songId} for userId: ${userId}`);

    // ✅ Remove songId from liked_songs (comma-separated list)
    await pool.query(
      `UPDATE users 
       SET liked_songs = TRIM(BOTH ',' FROM REPLACE(CONCAT(',', liked_songs, ','), CONCAT(',', ?, ','), ','))
       WHERE id = ?`,
      [songId, userId]
    );

    console.log(`✅ Track ${songId} unliked by user ${userId}`);

    return NextResponse.json({ message: "Track unliked" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error unliking track:", error);
    return NextResponse.json(
      { error: "Failed to unlike track" },
      { status: 500 }
    );
  }
}
