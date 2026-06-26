import { useState } from "react";
import { Link } from "react-router-dom";

function MovieCard({ title, rating, image, onAdd, onRemove, isFavorite, id, releaseDate }) {
  const [hovered, setHovered] = useState(false);
  const ratingPercentage = Math.round(rating * 10);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "10px",
        width: "200px",
        textAlign: "center",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hovered ? "translateY(-10px) scale(1.05)" : "scale(1)",
        boxShadow: hovered ? "0 20px 30px -10px rgba(0,0,0,0.3)" : "none",
        backgroundColor: "var(--card-bg)",
        cursor: "pointer"
      }}
    >
      <Link to={`/movie/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
        {image ? (
          <img 
            src={image} 
            alt={title} 
            style={{ 
              width: "100%", 
              borderRadius: "8px",
              height: "300px",
              objectFit: "cover"
            }} 
          />
        ) : (
          <div style={{ 
            width: "100%", 
            height: "300px", 
            backgroundColor: "#444", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            borderRadius: "8px",
            fontSize: "14px"
          }}>
            🎬 No Image
          </div>
        )}
        
        <h3 style={{ 
          margin: "10px 0 5px", 
          fontSize: "16px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {title || "No Title"}
        </h3>
        
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
          <span>⭐ {rating?.toFixed(1) || "N/A"}</span>
          {rating && (
            <span style={{ 
              backgroundColor: ratingPercentage >= 70 ? "#4caf50" : ratingPercentage >= 40 ? "#ff9800" : "#f44336",
              padding: "2px 6px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: "bold",
              color: "white"
            }}>
              {ratingPercentage}%
            </span>
          )}
        </div>
        
        {releaseDate && (
          <p style={{ fontSize: "12px", color: "#888", margin: "5px 0" }}>
            📅 {new Date(releaseDate).getFullYear()}
          </p>
        )}
      </Link>
      
      <button 
        onClick={(e) => {
          e.preventDefault();
          if (isFavorite && onRemove) onRemove();
          else if (!isFavorite && onAdd) onAdd();
        }}
        style={{
          marginTop: "10px",
          padding: "8px 16px",
          backgroundColor: isFavorite ? "#ff4444" : "#aa3bff",
          color: "white",
          border: "none",
          borderRadius: "20px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "bold",
          transition: "all 0.2s ease",
          width: "100%"
        }}
        onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
        onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
      >
        {isFavorite ? "Remove ❌" : "Add ❤️"}
      </button>
    </div>
  );
}

export default MovieCard;