import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ScrollAnimation } from "./ScrollAnimation"

const Login = () => {
  const { ref, visible } = ScrollAnimation()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()

    const users = JSON.parse(localStorage.getItem("users")) || []

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    )

    if (foundUser) {
      localStorage.setItem("loggedInUser", email)
      navigate("/home")   // go to home(main website)
    } else {
      alert("Wrong email or password")
    }
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
          Welcome!👋
        </h2>

        <p className="text-gray-500 text-center mt-2">
          Sign in to end up starving 🍔
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
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
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-lg bg-blue-500 text-white font-bold"
          >
            Sign In
          </button>

          <p className="text-sm text-gray-500 text-center mt-6">
  Don’t have an account?{" "}
  <span
    onClick={() => navigate("/signup")}
    className="text-blue-500 font-semibold cursor-pointer hover:underline"
  >
    Sign up
  </span>
</p>

        </form>
      </div>
    </div>
  )
}

export default Login

