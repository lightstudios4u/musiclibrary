"use client";
import { useState } from "react";

export default function Register({ onRegister }: { onRegister: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ Added confirmation field
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match"); // ✅ Check if passwords match
      return;
    }

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }

    setSuccess("🎉 Registration successful! Please log in.");
    onRegister(); // ✅ Callback to switch to login
  };

  return (
    <div className="modalcontainer">
      <div className="modal">
        <h2>Welcome!</h2>
        <br></br>
        <form
          onSubmit={handleRegister}
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
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <input
            className="standardinput"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className="standardbutton" type="submit">
            Create Account
          </button>
        </form>
        {error && <p style={{ color: "yellow", marginTop: "10px" }}>{error}</p>}
        {success && (
          <p style={{ color: "green", marginTop: "10px" }}>{success}</p>
        )}
      </div>
    </div>
  );
}
