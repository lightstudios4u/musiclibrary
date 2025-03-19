// app/api/articles/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "../../../../lib/db";
import { RowDataPacket } from "mysql2";
import { Article } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    console.log("Fetching article with id:", id);
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM articles WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Cast the first row as an Article
    const article: Article = rows[0] as Article;
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }
}
