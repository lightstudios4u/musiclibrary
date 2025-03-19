import { NextResponse } from "next/server";
import pool from "../../../../lib/db";
import { RowDataPacket } from "mysql2";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const query = "DELETE FROM articles WHERE id = ?";
    const [result] = await pool.query<RowDataPacket[]>(query, [id]);

    // Check if any row was affected (meaning the article existed)
    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Article removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to remove article" },
      { status: 500 }
    );
  }
}
