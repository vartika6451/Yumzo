'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ScrollAnimation } from "../../components/ScrollAnimation";
import useAuthStore from "../../store/useAuthStore";

export default function LoginPage() {
  const { ref, visible } = ScrollAnimation();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Try real API authentication first
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser({
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role || 'customer',
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem("loggedInUser", email);
        }
        router.push("/home");
        return;
      }

      // 2. Fallback to localStorage users for offline/client demo testing
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        setUser({
          id: 'user_' + Date.now(),
          name: email.split('@')[0],
          email: email,
          role: 'customer',
        });
        localStorage.setItem("loggedInUser", email);
        router.push("/home");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch {
      // Local fallback
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );
      if (foundUser) {
        localStorage.setItem("loggedInUser", email);
        router.push("/home");
      } else {
        setError("Invalid email or password");
      }
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
            Welcome Back! 👋
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Sign in to satisfy your cravings 🍔
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
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
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-8">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-red-500 font-bold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
