import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db"; // Your DB connection

export async function POST(req: NextRequest) {
  try {
    const { song_id, user_id, vote } = await req.json();

    if (![1, -1].includes(vote)) {
      return NextResponse.json(
        { error: "Invalid vote value" },
        { status: 400 }
      );
    }

    // Insert or update the vote
    await pool.query(
      `INSERT INTO votes (song_id, user_id, vote) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE vote = ?`,
      [song_id, user_id, vote, vote]
    );

    return NextResponse.json({ message: "Vote recorded" });
  } catch (error) {
    console.error("Voting Error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
