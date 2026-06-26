import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrailerModal from "../components/TrailerModal";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY ;
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

function MovieDetails({ favorites = [], setFavorites, darkMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [credits, setCredits] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const fetchMovieDetails = async () => {
      try {
        const [movieRes, creditsRes, similarRes, videosRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`)
        ]);

        if (!movieRes.ok) throw new Error("Movie not found");
        
        const movieData = await movieRes.json();
        const creditsData = await creditsRes.json();
        const similarData = await similarRes.json();
        const videosData = await videosRes.json();

        // Find the first YouTube trailer
        const trailer = videosData.results?.find(
          (video) => 
            video.type === "Trailer" && 
            video.site === "YouTube"
        ) || videosData.results?.find(
          (video) => 
            video.type === "Teaser" && 
            video.site === "YouTube"
        );

        setMovie(movieData);
        setCredits(creditsData);
        setSimilar(similarData.results || []);
        setTrailerKey(trailer?.key || null);
        
      } catch (err) {
        setError(err.message);
        console.error("Error fetching movie:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [id]);

  const toggleFavorite = () => {
    if (!movie) return;
    const exists = favorites.some((m) => m.id === movie.id);
    if (exists) {
      setFavorites((prev) => prev.filter((m) => m.id !== movie.id));
    } else {
      setFavorites((prev) => [...prev, movie]);
    }
  };

  // Error UI
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <div style={{ 
          backgroundColor: "#ff4444", 
          color: "white", 
          padding: "20px", 
          borderRadius: "10px",
          maxWidth: "400px",
          margin: "0 auto"
        }}>
          <h3>❌ Error Loading Movie</h3>
          <p>{error}</p>
          <button 
            onClick={() => navigate("/")}
            style={{
              padding: "10px 20px",
              marginTop: "10px",
              backgroundColor: "white",
              color: "#ff4444",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <div className="loading-spinner"></div>
      Loading movie details... 🎬
    </div>
  );
  
  if (!movie) return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Movie not found 😢</h2>
      <button onClick={() => navigate("/")} style={{
        padding: "10px 20px",
        marginTop: "20px",
        cursor: "pointer",
        borderRadius: "5px",
        border: "none",
        backgroundColor: "#aa3bff",
        color: "white"
      }}>
        Go Back Home
      </button>
    </div>
  );

  const isFavorite = favorites.some((m) => m.id === movie.id);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "Unknown";
  const ratingPercentage = Math.round(movie.vote_average * 10);
  const directors = credits?.crew?.filter(person => person.job === "Director").map(d => d.name) || [];
  const cast = credits?.cast?.slice(0, 10) || [];

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "1200px", 
      margin: "0 auto",
      position: "relative"
    }}>
      {/* Backdrop Image */}
      {movie.backdrop_path && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "100vh",
          zIndex: -1,
          opacity: 0.3,
          backgroundImage: `url(${TMDB_BACKDROP_BASE}${movie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(10px)"
        }} />
      )}

      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          marginBottom: "20px", 
          padding: "10px 20px",
          cursor: "pointer",
          borderRadius: "5px",
          border: "none",
          backgroundColor: darkMode ? "#444" : "#ddd",
          fontWeight: "bold"
        }}
      >
        ← Back to Movies
      </button>
      
      <div style={{ 
        display: "flex", 
        gap: "40px", 
        flexWrap: "wrap",
        backgroundColor: darkMode ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)",
        borderRadius: "20px",
        padding: "30px",
        backdropFilter: "blur(10px)"
      }}>
        {/* Poster */}
        <div style={{ flex: "0 0 300px" }}>
          {movie.poster_path ? (
            <img 
              src={`${TMDB_IMAGE_BASE}${movie.poster_path}`} 
              alt={movie.title}
              style={{ 
                width: "100%", 
                borderRadius: "15px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
              }}
            />
          ) : (
            <div style={{ 
              width: "100%", 
              height: "450px", 
              backgroundColor: "#444", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              borderRadius: "15px",
              fontSize: "18px"
            }}>
              No Poster Available
            </div>
          )}
          
          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            style={{
              padding: "12px 24px",
              marginTop: "10px",
              backgroundColor: isFavorite ? "#ff4444" : "#aa3bff",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "all 0.2s ease",
              width: "100%"
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            {isFavorite ? "Remove from Favorites ❌" : "Add to Favorites ❤️"}
          </button>

          {/* 🎬 TRAILER BUTTON - NEW */}
          {trailerKey && (
            <button
              onClick={() => setShowTrailer(true)}
              style={{
                padding: "12px 24px",
                marginTop: "10px",
                backgroundColor: "#ff0000",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "all 0.2s ease",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              ▶️ Watch Trailer
            </button>
          )}
        </div>
        
        {/* Details */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "32px", marginBottom: "10px" }}>
            {movie.title} <span style={{ fontSize: "24px", color: "#888" }}>({releaseYear})</span>
          </h2>
          
          {movie.tagline && (
            <p style={{ fontSize: "18px", fontStyle: "italic", color: "#aa3bff", marginBottom: "20px" }}>
              "{movie.tagline}"
            </p>
          )}
          
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "20px" }}>
            <div style={{ 
              backgroundColor: "#aa3bff", 
              padding: "8px 15px", 
              borderRadius: "20px",
              fontWeight: "bold"
            }}>
              ⭐ {movie.vote_average}/10 ({movie.vote_count} votes)
            </div>
            <div style={{ 
              backgroundColor: darkMode ? "#333" : "#ddd", 
              padding: "8px 15px", 
              borderRadius: "20px"
            }}>
              🎯 {ratingPercentage}% Match
            </div>
            {movie.runtime && (
              <div style={{ 
                backgroundColor: darkMode ? "#333" : "#ddd", 
                padding: "8px 15px", 
                borderRadius: "20px"
              }}>
                ⏱️ {movie.runtime} minutes
              </div>
            )}
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <h3>Genres:</h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {movie.genres?.map((genre) => (
                <span key={genre.id} style={{
                  backgroundColor: darkMode ? "#444" : "#eee",
                  padding: "5px 12px",
                  borderRadius: "15px",
                  fontSize: "14px"
                }}>
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
          
          {directors.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h3>Director{directors.length > 1 ? 's' : ''}:</h3>
              <p>{directors.join(", ")}</p>
            </div>
          )}
          
          <div style={{ marginBottom: "30px" }}>
            <h3>Overview:</h3>
            <p style={{ lineHeight: "1.6", textAlign: "justify" }}>
              {movie.overview || "No overview available."}
            </p>
          </div>
          
          {cast.length > 0 && (
            <div>
              <h3>Top Cast:</h3>
              <div style={{ display: "flex", gap: "15px", overflowX: "auto", padding: "10px 0" }}>
                {cast.map((actor) => (
                  <div key={actor.id} style={{ textAlign: "center", minWidth: "100px" }}>
                    {actor.profile_path ? (
                      <img 
                        src={`${TMDB_IMAGE_BASE}${actor.profile_path}`}
                        alt={actor.name}
                        style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{ width: "80px", height: "80px", backgroundColor: "#444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        🎭
                      </div>
                    )}
                    <p style={{ margin: "10px 0 0", fontSize: "12px", fontWeight: "bold" }}>{actor.name}</p>
                    <p style={{ margin: "0", fontSize: "11px", color: "#888" }}>{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Movies */}
      {similar.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h3>Similar Movies You Might Like:</h3>
          <div style={{ display: "flex", gap: "20px", overflowX: "auto", padding: "20px 0" }}>
            {similar.slice(0, 10).map((simMovie) => (
              <div 
                key={simMovie.id}
                onClick={() => navigate(`/movie/${simMovie.id}`)}
                style={{ 
                  minWidth: "150px", 
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  textAlign: "center"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                {simMovie.poster_path ? (
                  <img 
                    src={`${TMDB_IMAGE_BASE}${simMovie.poster_path}`}
                    alt={simMovie.title}
                    style={{ width: "150px", borderRadius: "10px" }}
                  />
                ) : (
                  <div style={{ width: "150px", height: "225px", backgroundColor: "#444", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    No Image
                  </div>
                )}
                <p style={{ marginTop: "10px", fontSize: "14px", fontWeight: "bold" }}>
                  {simMovie.title}
                </p>
                <p style={{ fontSize: "12px", color: "#888" }}>
                  {simMovie.release_date?.split("-")[0] || "Unknown"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🎬 TRAILER MODAL - NEW */}
      {showTrailer && trailerKey && (
        <TrailerModal
          trailerKey={trailerKey}
          title={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
}

export default MovieDetails;