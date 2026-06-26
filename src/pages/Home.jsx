import { useState, useEffect, useCallback, useMemo } from "react";
import MovieCard from "./MovieCard";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function Home({ favorites, setFavorites, darkMode }) {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("popular");
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch movies with REAL TMDB search
  const fetchMovies = useCallback(async (reset = false) => {
    if (!hasMore && !reset) return;
    
    setLoading(true);
    setError(null);
    
    const currentPage = reset ? 1 : page;
    
    let url = "";
    if (debouncedSearch) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(debouncedSearch)}&page=${currentPage}`;
    } else {
      switch(category) {
        case "popular":
          url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${currentPage}`;
          break;
        case "top_rated":
          url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=${currentPage}`;
          break;
        case "upcoming":
          url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=${currentPage}`;
          break;
        default:
          url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${currentPage}`;
      }
    }
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch movies");
      
      const data = await response.json();
      
      if (reset) {
        setMovies(data.results || []);
      } else {
        setMovies(prev => [...prev, ...(data.results || [])]);
      }
      
      setTotalResults(data.total_results || 0);
      setHasMore(currentPage < data.total_pages);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [debouncedSearch, category, page, hasMore]);

  // Reset when search or category changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchMovies(true);
  }, [debouncedSearch, category]);

  // Fetch when page changes
  useEffect(() => {
    if (page > 1) {
      fetchMovies(false);
    }
  }, [page]);

  const toggleFavorite = (movie) => {
    const exists = favorites.some((m) => m.id === movie.id);
    if (exists) {
      setFavorites((prev) => prev.filter((m) => m.id !== movie.id));
    } else {
      setFavorites((prev) => [...prev, movie]);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchTerm("");
    setDebouncedSearch("");
    setPage(1);
    setMovies([]);
  };

  // Memoized to prevent unnecessary re-renders
  const movieCards = useMemo(() => {
    return movies.map((movie) => (
      <MovieCard
        key={movie.id}
        id={movie.id}
        title={movie.title}
        rating={movie.vote_average}
        image={movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null}
        isFavorite={favorites.some((m) => m.id === movie.id)}
        onAdd={() => toggleFavorite(movie)}
        onRemove={() => toggleFavorite(movie)}
        releaseDate={movie.release_date}
      />
    ));
  }, [movies, favorites]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🍿 Popular Movies</h2>

      {/* Category Buttons */}
      <div style={{ margin: "20px 0", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => handleCategoryChange("popular")}
          style={{
            padding: "10px 20px",
            backgroundColor: category === "popular" ? "#aa3bff" : "transparent",
            color: "white",
            border: "1px solid #aa3bff",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          🔥 Popular
        </button>
        <button
          onClick={() => handleCategoryChange("top_rated")}
          style={{
            padding: "10px 20px",
            backgroundColor: category === "top_rated" ? "#aa3bff" : "transparent",
            color: "white",
            border: "1px solid #aa3bff",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          ⭐ Top Rated
        </button>
        <button
          onClick={() => handleCategoryChange("upcoming")}
          style={{
            padding: "10px 20px",
            backgroundColor: category === "upcoming" ? "#aa3bff" : "transparent",
            color: "white",
            border: "1px solid #aa3bff",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          🗓️ Upcoming
        </button>
      </div>

      {/* Search Input */}
      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="🔍 Search movies (real TMDB search)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "12px 20px",
            width: "350px",
            fontSize: "16px",
            borderRadius: "25px",
            border: "2px solid #aa3bff",
            backgroundColor: "var(--bg)",
            color: "var(--text-h)",
            outline: "none"
          }}
        />
        {searchTerm && (
          <p style={{ marginTop: "10px", fontSize: "14px", color: "#aa3bff" }}>
            Found {totalResults} movie{totalResults !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Error UI */}
      {error && (
        <div style={{ 
          backgroundColor: "#ff4444", 
          color: "white", 
          padding: "15px", 
          borderRadius: "10px",
          margin: "20px auto",
          maxWidth: "500px"
        }}>
          <p>❌ Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: "10px",
              padding: "5px 15px",
              backgroundColor: "white",
              color: "#ff4444",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && movies.length === 0 && (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <div className="loading-spinner"></div>
          Loading amazing movies... 🎬
        </div>
      )}

      {/* Movies Grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {movieCards}
      </div>

      {/* No Results */}
      {!loading && movies.length === 0 && !error && (
        <div style={{ marginTop: "40px" }}>
          <p style={{ fontSize: "18px" }}>
            {searchTerm ? `No movies found for "${searchTerm}" 😢` : "No movies available"}
          </p>
          {searchTerm && (
            <button 
              onClick={() => {
                setSearchTerm("");
                setDebouncedSearch("");
              }}
              style={{
                padding: "10px 20px",
                marginTop: "10px",
                backgroundColor: "#aa3bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Load More Button */}
      {!loading && !searchTerm && hasMore && movies.length > 0 && (
        <button
          onClick={loadMore}
          style={{
            padding: "12px 30px",
            marginTop: "40px",
            marginBottom: "20px",
            backgroundColor: "#aa3bff",
            color: "white",
            border: "none",
            borderRadius: "25px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          Load More Movies 🍿
        </button>
      )}

      {/* Loading indicator for more */}
      {loading && movies.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <div className="loading-spinner" style={{ width: "30px", height: "30px" }}></div>
        </div>
      )}
    </div>
  );
}

export default Home;