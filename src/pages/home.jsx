import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()

  // 🔐 Protect dashboard
  useEffect(() => {
    const user = localStorage.getItem("loggedInUser")
    if (!user) {
      navigate("/login")
    }
  }, [navigate])

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 px-4 py-2 bg-red-500 rounded"
      >
        Logout
      </button>

      <h1 className="text-3xl font-bold">Welcome to Yumzo 🍔</h1>
      <p className="mt-4">You are now inside the website.</p>
    </div>
  )
}

export default Home
