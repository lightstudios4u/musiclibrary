"use client";
import React from "react";
import "../style/main.css";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import Image from "next/image";
import ProfileMenu from "./ProfileMenu";

function Header() {
  const { isLoggedIn, isLoading } = useAuthStore();
  return (
    <div className="headercontainer">
      <Link href="/">
        <Image
          alt="Indie Share"
          src="/imgs/logo.png"
          width={100}
          height={50}
          style={{ width: "100%", height: "auto ", borderRadius: "4px" }}
        />
      </Link>
      {isLoggedIn && (
        <div>
          {/* {<p>{user?.username}</p>}
          <Link href="/upload">
            <p>Upload</p>
          </Link>

          <button onClick={logout}>Logout</button> */}
          <ProfileMenu />
        </div>
      )}
      {!isLoggedIn && !isLoading && (
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
