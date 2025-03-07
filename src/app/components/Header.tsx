"use client";
import React from "react";
import "../style/main.css";
import Link from "next/link";
import { useAuthStore } from "@/lib/authStore";

function Header() {
  const { logout, isLoggedIn, user } = useAuthStore();
  return (
    <div className="headercontainer">
      <Link href="/">
        <p>Indie Share</p>
      </Link>
      {isLoggedIn && (
        <div>
          {<p>{user?.username}</p>}
          <Link href="/upload">
            <p>Upload</p>
          </Link>

          <button onClick={logout}>Logout</button>
        </div>
      )}
      {!isLoggedIn && (
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/login">
            <p>Login</p>
          </Link>
          <Link href="/signup">
            <p>Register</p>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
