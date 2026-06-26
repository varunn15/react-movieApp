import MovieCard from "./MovieCard";
import { Link } from "react-router-dom";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function Favorites({ favorites, setFavorites, darkMode }) {
  const removeFromFavorites = (movie) => {
    setFavorites((prev) => prev.filter((m) => m.id !== movie.id));
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>My Favorites ❤️</h2>
      <p>Movies you've saved to watch later</p>

      {favorites.length === 0 ? (
        <div style={{ 
          marginTop: "50px",
          padding: "40px",
          backgroundColor: darkMode ? "#1f2028" : "#f9f9f9",
          borderRadius: "15px"
        }}>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>
            No favorite movies yet 😢
          </p>
          <Link to="/">
            <button style={{
              padding: "12px 24px",
              backgroundColor: "#aa3bff",
              color: "white",
              border: "none",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "16px"
            }}>
              Browse Movies 🎬
            </button>
          </Link>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: "20px", color: "#aa3bff" }}>
            You have {favorites.length} favorite movie{favorites.length !== 1 ? "s" : ""}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
            {favorites.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                rating={movie.vote_average}
                image={movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null}
                isFavorite={true}
                onRemove={() => removeFromFavorites(movie)}
                releaseDate={movie.release_date}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Favorites;