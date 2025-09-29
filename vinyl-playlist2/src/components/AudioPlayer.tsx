import { useEffect, useRef } from "react";
import type { SongMeta } from "../types";

interface Props {
  song?: SongMeta;
  isPlaying: boolean;
  onEnded: () => void;
  onTimeUpdate: (time: number) => void;
  seekTime: number;
  onDuration: (duration: number) => void;
}

export default function AudioPlayer({ song, isPlaying, onEnded, onTimeUpdate, seekTime, onDuration }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play();
    else audioRef.current.pause();
  }, [isPlaying, song]);

  useEffect(() => {
    if (seekTime >= 0 && audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  }, [seekTime]);

  return (
    <audio
      ref={audioRef}
      src={song?.file}
      onEnded={onEnded}
      onTimeUpdate={() => {
        if (audioRef.current) onTimeUpdate(audioRef.current.currentTime);
      }}
      onLoadedMetadata={() => {
        if (audioRef.current) onDuration(audioRef.current.duration);
      }}
    />
  );
}