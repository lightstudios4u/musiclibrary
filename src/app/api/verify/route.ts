import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "../../../lib/db";
import { useAuthStore } from "@/lib/store/authStore";

const SECRET_KEY = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    console.log("verifying token...");
    // ✅ Read token from cookie
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, SECRET_KEY) as { user_id: number };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rows]: any = await pool.query(
      "SELECT id, email, username FROM users WHERE id = ?",
      [decoded.user_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = rows[0];
    useAuthStore.setState({
      isLoggedIn: true,
      isLoading: false,
      user: {
        id: decoded.user_id,
        email: user.email, // Assuming you fetched email
        username: user.username, // Assuming you fetched username
      },
      token,
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
