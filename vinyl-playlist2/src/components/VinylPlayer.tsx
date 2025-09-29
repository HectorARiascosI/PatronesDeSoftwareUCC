import React, { useEffect, useRef, useState } from "react";
import type { SongMeta } from "../types"; // ✅ importa el tipo desde types.ts

interface VinylPlayerProps {
  song: SongMeta | null;
  isPlaying: boolean;
  onEnded: () => void;
  onTimeUpdate?: (current: number, duration: number) => void;
}

const VinylPlayer: React.FC<VinylPlayerProps> = ({
  song,
  isPlaying,
  onEnded,
  onTimeUpdate,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, song]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 0;
      setProgress((current / duration) * 100);
      if (onTimeUpdate) {
        onTimeUpdate(current, duration);
      }
    }
  };

  // ✅ Slider seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime =
        (parseFloat(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  return (
    <div className="vinyl-player">
      {song ? (
        <>
          <p>
            Reproduciendo: <b>{song.title}</b> - {song.artist}
          </p>
          <audio
            ref={audioRef}
            src={song.file} // ✅ usar "file" como en SongMeta
            onEnded={onEnded}
            onTimeUpdate={handleTimeUpdate}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
          />
        </>
      ) : (
        <p>No hay canción seleccionada 🎵</p>
      )}
    </div>
  );
};

export default VinylPlayer;