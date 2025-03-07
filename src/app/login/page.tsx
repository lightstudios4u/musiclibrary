"use client";
import React from "react";
import Login from "../components/Login";
interface LoginProps {
  onLogin: () => void;
}

function page({ onLogin }: LoginProps) {
  return <Login />;
}

export default page;
