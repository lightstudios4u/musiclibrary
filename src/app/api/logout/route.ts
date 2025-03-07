import { NextResponse } from "next/server";

export async function POST() {
  // Clear authentication cookie (assuming JWT stored in 'token')
  const response = NextResponse.json({ message: "Logged out successfully" });
  response.headers.set("Set-Cookie", "token=; Path=/; HttpOnly; Max-Age=0");

  return response;
}
