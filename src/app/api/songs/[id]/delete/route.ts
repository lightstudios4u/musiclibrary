import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../../lib/db"; // ✅ Ensure correct path to your DB

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // ✅ Correct way to await params
    const { id } = await context.params;

    // ✅ Ensure ID is valid
    if (!id) {
      return NextResponse.json({ error: "Missing song ID" }, { status: 400 });
    }

    // ✅ Delete song from database
    const [result] = await pool.query("DELETE FROM songs WHERE id = ?", [id]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Song deleted successfully" });
  } catch (error) {
    console.error("Error deleting song:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
