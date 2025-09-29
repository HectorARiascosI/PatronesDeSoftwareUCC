import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";

interface Props {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export default function Controls({ isPlaying, onPlayPause, onNext, onPrev, currentTime, duration, onSeek }: Props) {
  function formatTime(sec: number) {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
      <div style={{display:"flex",gap:20,alignItems:"center"}}>
        <button className="btn-prev" onClick={onPrev}><FaStepBackward/></button>
        <button className="btn-play" onClick={onPlayPause}>{isPlaying ? <FaPause/> : <FaPlay/>}</button>
        <button className="btn-next" onClick={onNext}><FaStepForward/></button>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,width:"100%"}}>
        <span style={{fontSize:12}}>{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          step={0.5}
          onChange={(e) => onSeek(Number(e.target.value))}
          style={{flex:1}}
        />
        <span style={{fontSize:12}}>{formatTime(duration)}</span>
      </div>
    </div>
  );
}