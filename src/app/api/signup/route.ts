import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();
    console.log(username, email, password);
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password

    await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
