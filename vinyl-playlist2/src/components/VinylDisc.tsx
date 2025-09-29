import React from "react";

interface Props {
  cover?: string | null;
  isPlaying?: boolean;
  size?: number;
}

export default function VinylDisc({ cover, isPlaying = false, size = 220 }: Props) {
  const discStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    background: "radial-gradient(circle at 50% 50%, #222 0%, #000 65%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.7)",
    overflow: "hidden",
    position: "relative",
  };

  const innerStyle: React.CSSProperties = {
    width: size * 0.8,
    height: size * 0.8,
    borderRadius: "50%",
    backgroundImage: cover ? `url(${cover})` : "linear-gradient(135deg,#444,#222)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "transform 0.4s ease",
  };

  const spinClass = isPlaying ? "vinyl-spin" : "";

  return (
    <div className="vinyl" style={discStyle}>
      <div className={`vinyl-inner ${spinClass}`} style={innerStyle} />
      <div style={{
        position:"absolute",
        width: size * 0.12,
        height: size * 0.12,
        borderRadius: "50%",
        background: "#000",
        border: "4px solid #333"
      }} />
      <style>{`
        .vinyl-inner.vinyl-spin {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}