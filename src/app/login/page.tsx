"use client";
import React from "react";
import Login from "../components/Login";

function page() {
  return <Login onLogin={() => console.log("logged in")} />;
}

export default page;
