import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";
import type { SongMeta } from "./types";
import { useId3Resources } from "./hooks/useId3";
import Controls from "./components/Controls";
import PlaylistQueue from "./components/PlaylistQueue";
import VinylDisc from "./components/VinylDisc";
import { DoublyLinkedList } from "./utils/DoublyLinkedList";

function App() {
  const publicFiles = useMemo(() => [], []);
  const loaded = useId3Resources(publicFiles);

  const playlistList = useMemo(() => new DoublyLinkedList<SongMeta>(), []);
  const [playlist, setPlaylist] = useState<SongMeta[]>([]);

  const [currentId, setCurrentId] = useState<string | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (loaded.length && playlist.length === 0) {
      loaded.forEach(song => playlistList.append(song));
      setPlaylist(playlistList.toArray());
    }
  }, [loaded]);

  const currentIndex = Math.max(0, playlist.findIndex(s => s.id === currentId));
  const currentSong = playlist[currentIndex];

  useEffect(() => {
    if (!currentSong && playlist.length > 0) {
      setCurrentId(playlist[0].id);
    }
  }, [playlist, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play();
      else audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  function handleSelect(id: string) {
    setCurrentId(id);
    setIsPlaying(true);
    setCurrentTime(0);
  }

  function handleRemove(id: string) {
    playlistList.remove(s => s.id === id);
    const newArray = playlistList.toArray();
    setPlaylist(newArray);

    if (id === currentId) {
      const idx = newArray.findIndex(s => s.id === id);
      const newCurrent = newArray[idx] ?? newArray[idx - 1] ?? newArray[0];
      setCurrentId(newCurrent?.id);
      setIsPlaying(Boolean(newCurrent));
    }
  }

  function handleNext() {
    if (!playlist.length) return;
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      const index = playlist.findIndex(s => s.id === currentId);
      nextIndex = (index + 1) % playlist.length;
    }
    setCurrentId(playlist[nextIndex].id);
    setIsPlaying(true);
  }

  function handlePrev() {
    if (!playlist.length) return;
    let prevIndex;
    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      const index = playlist.findIndex(s => s.id === currentId);
      prevIndex = (index - 1 + playlist.length) % playlist.length;
    }
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
            playlistList.append(obj);
            setPlaylist(playlistList.toArray());
            resolve();
          },
          onError: () => {
            const obj: SongMeta = {
              id: Math.random().toString(36).slice(2,9),
              title: file.name,
              artist: "Artista desconocido",
              file: URL.createObjectURL(file)
            };
            playlistList.append(obj);
            setPlaylist(playlistList.toArray());
            resolve();
          }
        });
      });
    }
  }

  return (
    <div className="app">
      <img src="/assets/whisky-bottle.png" className="bottle" alt="Botella de whisky" />

      <audio
        ref={audioRef}
        key={currentSong?.id}
        src={currentSong?.file}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={handleNext} // reproduce siguiente automáticamente
      />

      <div style={{
        flex:1,
        maxWidth:540,
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        gap:28
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
          onSeek={(t) => {
            if (audioRef.current) audioRef.current.currentTime = t;
            setCurrentTime(t);
          }}
          isShuffle={isShuffle}               // nuevo
          onToggleShuffle={() => setIsShuffle(s => !s)} // nuevo
        />

        <div style={{
          width:"100%",
          display:"flex",
          gap:12,
          justifyContent:"center",
          marginTop:12
        }}>
          <input
            aria-label="upload"
            id="upload"
            type="file"
            accept="audio/*"
            multiple
            onChange={(e)=>handleUpload(e.target.files)}
          />
          <button className="btn" onClick={() => {
            playlistList.head = playlistList.tail = null;
            playlistList.length = 0;
            setPlaylist([]);
            setCurrentId(undefined);
            setIsPlaying(false);
          }}>
            Limpiar
          </button>
        </div>
      </div>

      <div style={{width:360}}>
        <PlaylistQueue
          songs={playlist}
          currentId={currentSong?.id}
          onSelect={handleSelect}
          onRemove={handleRemove}
          onReorder={(newOrder: SongMeta[]) => {
            playlistList.head = playlistList.tail = null;
            playlistList.length = 0;
            newOrder.forEach(song => playlistList.append(song));
            setPlaylist(playlistList.toArray());
          }}
        />
      </div>
    </div>
  );
}

export default App;