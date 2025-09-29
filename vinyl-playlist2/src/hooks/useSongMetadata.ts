import { useEffect, useState } from "react";
import jsmediatags from "jsmediatags";

export interface SongMeta {
  title: string;
  artist: string;
  album: string;
  picture?: string; // base64 de la portada
  file: string;
}

export function useSongMetadata(files: string[]) {
  const [songs, setSongs] = useState<SongMeta[]>([]);

  useEffect(() => {
    const loadSongs = async () => {
      const results: SongMeta[] = [];

      for (const file of files) {
        await new Promise<void>((resolve) => {
          jsmediatags.read(file, {
            onSuccess: (tag) => {
              let picture;
              if (tag.tags.picture) {
                const { data, format } = tag.tags.picture;
                let base64String = "";
                for (let i = 0; i < data.length; i++) {
                  base64String += String.fromCharCode(data[i]);
                }
                picture = `data:${format};base64,${window.btoa(base64String)}`;
              }

              results.push({
                title: tag.tags.title || file.split("/").pop() || "Desconocido",
                artist: tag.tags.artist || "Artista Desconocido",
                album: tag.tags.album || "Álbum Desconocido",
                picture,
                file,
              });
              resolve();
            },
            onError: () => {
              results.push({
                title: file.split("/").pop() || "Desconocido",
                artist: "Artista Desconocido",
                album: "Álbum Desconocido",
                file,
              });
              resolve();
            },
          });
        });
      }
      setSongs(results);
    };

    loadSongs();
  }, [files]);

  return songs;
}
