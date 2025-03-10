import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET!;

export const getSession = async () => {
  try {
    const cookieStore = cookies();
    const cookie = await cookieStore;
    const token = cookie.get("token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, SECRET_KEY) as { user_id: number };
    console.log("Decoded token:", decoded);

    // ✅ Return token and user ID (no state setting here)
    return { token, userId: decoded.user_id };
  } catch (error) {
    console.error("Session Error:", error);
    return null;
  }
};
