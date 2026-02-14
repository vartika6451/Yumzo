import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ScrollAnimation } from "./ScrollAnimation"

const Signup = () => {
  const { ref, visible } = ScrollAnimation()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = (e) => {
    e.preventDefault()

    const users = JSON.parse(localStorage.getItem("users")) || []

    // check if user already exists
    const userExists = users.find((u) => u.email === email)

    if (userExists) {
      alert("User already exists. Please login.")
      return
    }

    // add new user
    users.push({ email, password })
    localStorage.setItem("users", JSON.stringify(users))

    alert("Signup successful! Please login.")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div
        ref={ref}
        className={`login-card w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 ${
          visible ? "show" : ""
        }`}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Create Account ✨
        </h2>

        <p className="text-gray-500 text-center mt-2">
          Sign up to start ordering 🍕
        </p>

        <form onSubmit={handleSignup} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full mt-2 px-4 py-3 rounded-lg border"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full mt-2 px-4 py-3 rounded-lg border"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default Signup
