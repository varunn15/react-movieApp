import { useState } from "react";
import YouTube from "react-youtube";

function TrailerModal({ trailerKey, title, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // YouTube player options
  const opts = {
    height: "400",
    width: "100%",
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
    },
  };

  // Close on ESC key
  useState(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
        animation: "fadeIn 0.3s ease-out",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "15px",
          maxWidth: "800px",
          width: "100%",
          padding: "20px",
          position: "relative",
          boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "15px",
            background: "none",
            border: "none",
            color: "white",
            fontSize: "28px",
            cursor: "pointer",
            zIndex: 10,
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => e.target.style.transform = "scale(1.2)"}
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
        >
          ✕
        </button>

        {/* Title */}
        <h3 style={{ 
          color: "white", 
          marginBottom: "15px",
          paddingRight: "40px"
        }}>
          🎬 {title} - Trailer
        </h3>

        {/* YouTube Player */}
        <div style={{ borderRadius: "10px", overflow: "hidden" }}>
          <YouTube
            videoId={trailerKey}
            opts={opts}
            onReady={(e) => {
              setIsPlaying(true);
              e.target.playVideo();
            }}
            onEnd={() => setIsPlaying(false)}
            style={{ borderRadius: "10px" }}
          />
        </div>

        {/* Instructions */}
        <p style={{ 
          color: "#888", 
          fontSize: "12px", 
          marginTop: "10px",
          textAlign: "center"
        }}>
          Press ESC to close • Click outside to close
        </p>
      </div>
    </div>
  );
}

export default TrailerModal;