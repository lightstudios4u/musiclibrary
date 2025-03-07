import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";

const SECRET_KEY = process.env.JWT_SECRET!; // Store in .env

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received Login Payload:", body); // ✅ Debug payload

    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    console.log(rows);
    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = rows[0];
    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign({ user_id: user.id }, SECRET_KEY, {
      expiresIn: "7d",
    });

    return NextResponse.json({
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
