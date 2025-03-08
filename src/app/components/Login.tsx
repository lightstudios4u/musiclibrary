"use client";
import { useState } from "react";
import { useAuthStore } from "../../lib/store/authStore";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const errorMessage = await login(email, password);
      if (errorMessage) {
        setError(errorMessage);
        return;
      }

      setSuccess(true); // ✅ Show success message
      setTimeout(() => {
        router.push("/"); // ✅ Redirect after delay
      }, 1500);
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="modalcontainer">
      <div className="modal">
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <h2>Welcome back!</h2>
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
        </form>

        {/* ✅ Success Message */}
        {success && (
          <p style={{ color: "green", marginTop: "10px" }}>
            🎉 Login Successful!
          </p>
        )}

        {/* ✅ Error Message */}
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
}
