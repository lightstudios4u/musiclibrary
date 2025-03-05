import React from "react";
import "../style/main.css";
import Link from "next/link";

function Header() {
  return (
    <div className="headercontainer">
      <Link href="/">
        <p>Indie Share</p>
      </Link>
      <Link href="/upload">
        <p>Upload</p>
      </Link>
    </div>
  );
}

export default Header;
