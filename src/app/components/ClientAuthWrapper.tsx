"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

const verifyToken = async () => {
  try {
    const res = await fetch("/api/verify", {
      method: "GET",
      credentials: "include", // ✅ Include cookies with the request
    });

    if (res.ok) {
      const user = await res.json();

      // ✅ Update Zustand state
      useAuthStore.setState({
        token: user.token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        isLoggedIn: true,
        isLoading: false,
      });
    } else {
      console.log("Invalid token");
      useAuthStore.setState({ isLoading: false, isLoggedIn: false });
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    useAuthStore.setState({ isLoading: false, isLoggedIn: false });
  }
};

export default function ClientAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    verifyToken();
  }, []);

  return <>{children}</>;
}
