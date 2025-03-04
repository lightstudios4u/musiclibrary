import React from "react";
import "../style/main.css";
import Link from "next/link";

function Header() {
  return (
    <div className="headercontainer">
      <div className="header">
        <Link href="/">
          <p>Home</p>
        </Link>
        <Link href="/upload">
          <p>Upload</p>
        </Link>
      </div>
    </div>
  );
}

export default Header;
