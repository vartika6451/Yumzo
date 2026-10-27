'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ScrollAnimation } from "../../components/ScrollAnimation";

export default function SignupPage() {
  const { ref, visible } = ScrollAnimation();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Try real API registration
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || email.split('@')[0], email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created successfully! Please sign in.");
        router.push("/login");
        return;
      }

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userExists = users.find((u) => u.email === email);

      if (userExists) {
        setError("User already exists. Please login.");
        return;
      }

      // Add to local storage
      users.push({ name: name || email.split('@')[0], email, password });
      localStorage.setItem("users", JSON.stringify(users));

      alert("Signup successful! Please login.");
      router.push("/login");
    } catch {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      users.push({ name: name || email.split('@')[0], email, password });
      localStorage.setItem("users", JSON.stringify(users));

      alert("Signup successful! Please login.");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div
        ref={ref}
        className={`login-card w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 ${
          visible ? "show" : ""
        }`}
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-3xl font-black mb-2">
            <span className="text-red-500">Yum</span>
            <span className="text-yellow-500 italic">zo</span>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
            Create Account ✨
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Sign up to start ordering delicious bites 🍕
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Doe"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-400 bg-gray-50 text-sm font-medium transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-400 bg-gray-50 text-sm font-medium transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-400 bg-gray-50 text-sm font-medium transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-red-500 to-yellow-500 text-white font-extrabold text-base hover:opacity-95 transition shadow-lg shadow-red-500/25 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-8">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-red-500 font-bold hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
