import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../lib/db"; // Ensure correct path
import { RowDataPacket } from "mysql2"; // ✅ Import correct type

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const song_id = params.id;

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT COALESCE(SUM(vote), 0) AS score FROM votes WHERE song_id = ?",
      [song_id]
    );

    const score = (rows[0] as { score: number }).score || 0;

    return NextResponse.json({ score });
  } catch (error) {
    console.error("Error fetching score:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
