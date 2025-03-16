import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "../../../lib/db";

const SECRET_KEY = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    console.log("🔎 Verifying token...");

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

    const [rows]: any = await pool.query(
      "SELECT id, email, username FROM users WHERE id = ?",
      [decoded.user_id]
    );

    if (rows.length === 0) {
      console.warn("❌ User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = rows[0];
    console.log("✅ User found:", user);

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
