import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");

  console.log("Token detected:", token);

  const res = NextResponse.next();

  // ✅ Allow credentials (cookies)
  res.headers.set("Access-Control-Allow-Credentials", "true");

  // ✅ Adjust the origin for your environment (use '*' for dev or specific origin for prod)
  res.headers.set(
    "Access-Control-Allow-Origin",
    process.env.NODE_ENV === "production"
      ? "https://your-production-domain.com"
      : "http://localhost:3000"
  );

  // ✅ Allow necessary methods
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  // ✅ Allow necessary headers
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (!token && req.nextUrl.pathname !== "/login") {
    // ✅ Redirect to login if token is missing
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

// ✅ Match only protected routes
export const config = {
  matcher: ["/dashboard", "/profile", "/upload", "/api/verify"], // ✅ Add /api/verify
};
