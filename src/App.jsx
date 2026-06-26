import { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  const { currentUser, logout } = useAuth();
  const [favorites, setFavorites] = useState(() => {
    // User-specific favorites
    if (currentUser) {
      const saved = localStorage.getItem(`favorites_${currentUser.uid}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true;
  });
  const navigate = useNavigate();

  // Save favorites when user changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`favorites_${currentUser.uid}`, JSON.stringify(favorites));
    }
  }, [favorites, currentUser]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
        <h1 style={{ margin: 0, cursor: "pointer" }} onClick={() => navigate("/")}>
          Movie App 🎬
        </h1>
        
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {currentUser && (
            <span style={{ fontSize: "14px", color: "#aa3bff" }}>
              👋 {currentUser.displayName || currentUser.email}
            </span>
          )}
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: "10px 20px",
              fontSize: "20px",
              cursor: "pointer",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              border: "none",
              backgroundColor: darkMode ? "#ffd700" : "#333",
              color: darkMode ? "#333" : "#ffd700"
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {currentUser && (
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                backgroundColor: "#ff4444",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Logout 🚪
            </button>
          )}
        </div>
      </div>

      <nav style={{ textAlign: "center", marginBottom: "20px" }}>
        <Link to="/" style={{ margin: "0 10px", padding: "8px 16px", textDecoration: "none", color: "white", border: "1px solid #aa3bff", borderRadius: "5px", display: "inline-block" }}>
          Home
        </Link>
        {currentUser && (
          <Link to="/favorites" style={{ margin: "0 10px", padding: "8px 16px", textDecoration: "none", color: "white", border: "1px solid #aa3bff", borderRadius: "5px", display: "inline-block" }}>
            Favorites ({favorites.length})
          </Link>
        )}
        {!currentUser && (
          <>
            <Link to="/login" style={{ margin: "0 10px", padding: "8px 16px", textDecoration: "none", color: "white", border: "1px solid #aa3bff", borderRadius: "5px", display: "inline-block" }}>
              Login
            </Link>
            <Link to="/signup" style={{ margin: "0 10px", padding: "8px 16px", textDecoration: "none", color: "white", border: "1px solid #aa3bff", borderRadius: "5px", display: "inline-block" }}>
              Sign Up
            </Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home favorites={favorites} setFavorites={setFavorites} darkMode={darkMode} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/movie/:id" element={<MovieDetails favorites={favorites} setFavorites={setFavorites} darkMode={darkMode} />} />
        <Route path="/favorites" element={
          <ProtectedRoute>
            <Favorites favorites={favorites} setFavorites={setFavorites} darkMode={darkMode} />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;