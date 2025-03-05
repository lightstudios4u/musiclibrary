"use client";
import { useState } from "react";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    // ✅ Store token in localStorage
    localStorage.setItem("token", data.token);
    alert("Login successful!");
    onLogin(); // Callback function to update UI
  };

  return (
    <div>
      <div className="modalcontainer">
        <div className="modal">
          <h2>Login</h2>
          <br />
          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <input
              className="standardinput"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="standardinput"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="standardbutton" type="submit">
              Login
            </button>
            <a href="/register">Don't have an account? Register</a>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
``;
