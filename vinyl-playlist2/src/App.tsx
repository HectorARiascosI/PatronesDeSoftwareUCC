import { useEffect, useMemo, useState } from "react";
import "./index.css";
import type { SongMeta } from "./types";
import { useId3Resources } from "./hooks/useId3";
import AudioPlayer from "./components/AudioPlayer";
import Controls from "./components/Controls";
import PlaylistQueue from "./components/PlaylistQueue";
import VinylDisc from "./components/VinylDisc";

function App() {
  const publicFiles = useMemo(() => [], []);
  const loaded = useId3Resources(publicFiles);

  const [playlist, setPlaylist] = useState<SongMeta[]>([]);
  useEffect(() => {
    if (loaded.length && playlist.length === 0) setPlaylist(loaded);
  }, [loaded]);

  const [currentId, setCurrentId] = useState<string | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(-1);

  const currentIndex = Math.max(0, playlist.findIndex(s => s.id === currentId));
  const currentSong = playlist[currentIndex];

  useEffect(() => {
    if (!currentSong && playlist.length > 0) {
      setCurrentId(playlist[0].id);
    }
  }, [playlist, currentSong]);

  function handleSelect(id: string) {
    setCurrentId(id);
    setIsPlaying(true);
    setCurrentTime(0);
  }

  function handleRemove(id: string) {
    const idx = playlist.findIndex((p) => p.id === id);
    const nxt = playlist.filter((p) => p.id !== id);
    setPlaylist(nxt);
    if (id === currentId) {
      const newCurrent = nxt[idx] ?? nxt[idx - 1] ?? nxt[0];
      setCurrentId(newCurrent?.id);
      setIsPlaying(Boolean(newCurrent));
    }
  }

  function handleNext() {
    if (!playlist.length) return;
    const index = playlist.findIndex(s => s.id === currentId);
    const nextIndex = (index + 1) % playlist.length;
    setCurrentId(playlist[nextIndex].id);
    setIsPlaying(true);
  }

  function handlePrev() {
    if (!playlist.length) return;
    const index = playlist.findIndex(s => s.id === currentId);
    const prevIndex = (index - 1 + playlist.length) % playlist.length;
    setCurrentId(playlist[prevIndex].id);
    setIsPlaying(true);
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    const jsmediatags = (await import("jsmediatags")).default;
    for (const file of Array.from(files)) {
      await new Promise<void>((resolve) => {
        jsmediatags.read(file, {
          onSuccess: (tag: any) => {
            let picture;
            if (tag.tags?.picture) {
              const { data, format } = tag.tags.picture;
              let base64 = "";
              for (let i=0;i<data.length;i++) base64 += String.fromCharCode(data[i]);
              picture = `data:${format};base64,${window.btoa(base64)}`;
            }
            const obj: SongMeta = {
              id: Math.random().toString(36).slice(2,9),
              title: tag.tags.title || file.name,
              artist: tag.tags.artist || "Artista desconocido",
              album: tag.tags.album,
              cover: picture,
              file: URL.createObjectURL(file)
            };
            setPlaylist(prev => [...prev, obj]);
            resolve();
          },
          onError: () => {
            const obj: SongMeta = {
              id: Math.random().toString(36).slice(2,9),
              title: file.name,
              artist: "Artista desconocido",
              file: URL.createObjectURL(file)
            };
            setPlaylist(prev => [...prev, obj]);
            resolve();
          }
        });
      });
    }
  }

  return (
    <div className="app">
      {/* ==== Botella flotante ==== */}
      <img src="/assets/whisky-bottle.png" className="bottle" alt="Botella de whisky" />
        
      {/* ==== Columna izquierda: disco + controles + upload ==== */}
      <div style={{
        flex:1,
        maxWidth:540,
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        gap:28  // aumenta el espacio entre cada elemento automáticamente
      }}>
        <VinylDisc cover={currentSong?.cover} isPlaying={isPlaying} />

        <div style={{textAlign:"center", marginTop:12}}>
          { currentSong ? (
            <>
              <div style={{fontWeight:700, fontSize:20, color:"#e0b84a"}}>{currentSong.title}</div>
              <div style={{fontSize:14, color:"#f0e68c"}}>{currentSong.artist} · {currentSong.album ?? ""}</div>
            </>
          ) : <div style={{fontWeight:700, fontSize:20}}>No hay canción</div> }
        </div>

        <Controls
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(p => !p)}
          onNext={handleNext}
          onPrev={handlePrev}
          currentTime={currentTime}
          duration={duration}
          onSeek={(t) => setSeekTime(t)}
        />

        <div style={{
          width:"100%",
          display:"flex",
          gap:12,
          justifyContent:"center",
          marginTop:12 // un pequeño extra para separar del control
        }}>
          <input
            aria-label="upload"
            id="upload"
            type="file"
            accept="audio/*"
            multiple
            onChange={(e)=>handleUpload(e.target.files)}
          />
          <button className="btn" onClick={()=>{ setPlaylist([]); setCurrentId(undefined); setIsPlaying(false); }}>
            Limpiar
          </button>
        </div>

        <AudioPlayer
          song={currentSong}
          isPlaying={isPlaying}
          onEnded={handleNext}
          onTimeUpdate={(time) => setCurrentTime(time)}
          seekTime={seekTime}
          onDuration={(d) => setDuration(d)}
        />
      </div>

      {/* ==== Columna derecha: playlist ==== */}
      <div style={{width:360}}>
        <PlaylistQueue
          songs={playlist}
          currentId={currentSong?.id}
          onSelect={handleSelect}
          onRemove={handleRemove}
          onReorder={(newOrder: SongMeta[]) => setPlaylist(newOrder)}
        />
      </div>
    </div>
  );
}

export default App;