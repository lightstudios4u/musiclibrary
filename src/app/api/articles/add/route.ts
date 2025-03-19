import { NextResponse } from "next/server";
import pool from "../../../../lib/db";
import { RowDataPacket } from "mysql2";
import { Article } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Expected properties: title, content, author, publicationDate, category, tags, imageUrl
    const {
      title,
      content,
      author,
      publicationDate,
      category,
      tags,
      imageUrl,
    } = body;

    const query = `
      INSERT INTO articles 
        (title, content, author, publication_date, category, tags, image_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    // Convert tags array to a comma-separated string if provided.
    const values = [
      title,
      content,
      author || null,
      publicationDate,
      category || null,
      tags ? tags.join(",") : null,
      imageUrl || null,
    ];

    const [result] = await pool.query<RowDataPacket[]>(query, values);
    const returnedArticle = result as Article[];

    // result.insertId contains the new article's ID (if using mysql2 with proper types)
    return NextResponse.json(
      { message: "Article added successfully", id: returnedArticle[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to add article" },
      { status: 500 }
    );
  }
}
