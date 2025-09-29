import { useEffect, useState } from "react";
import type { SongMeta } from "../types";

export function useId3Resources(publicFiles: string[]) {
  const [songs, setSongs] = useState<SongMeta[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      // Try to read ID3 via jsmediatags if available; fallback to filename + placeholder cover
      const jsmediatags = await import("jsmediatags").then(m => m.default).catch(() => null);

      const loaded: SongMeta[] = [];
      for (const url of publicFiles) {
        if (cancelled) break;
        const id = Math.random().toString(36).slice(2, 9);
        if (!jsmediatags) {
          const title = url.split("/").pop() ?? "Unknown";
          loaded.push({
            id,
            title,
            artist: "Unknown artist",
            file: url,
            cover: `https://source.unsplash.com/collection/1197440/400x400?sig=${encodeURIComponent(title)}`
          });
          continue;
        }

        try {
          // fetch file as blob to read tags
          const r = await fetch(url);
          const blob = await r.blob();
          await new Promise<void>((resolve) => {
            // @ts-ignore
            jsmediatags.read(blob, {
              onSuccess: (tag: any) => {
                let picture = undefined;
                if (tag.tags?.picture) {
                  const { data, format } = tag.tags.picture;
                  let base64 = "";
                  for (let i = 0; i < data.length; i++) base64 += String.fromCharCode(data[i]);
                  picture = `data:${format};base64,${window.btoa(base64)}`;
                }
                const title = tag.tags.title || (url.split("/").pop() ?? "Unknown");
                const artist = tag.tags.artist || "Unknown artist";
                loaded.push({
                  id,
                  title,
                  artist,
                  album: tag.tags.album,
                  cover: picture ?? `https://source.unsplash.com/collection/1197440/400x400?sig=${encodeURIComponent(title)}`,
                  file: url
                });
                resolve();
              },
              onError: () => {
                const title = url.split("/").pop() ?? "Unknown";
                loaded.push({
                  id,
                  title,
                  artist: "Unknown artist",
                  file: url,
                  cover: `https://source.unsplash.com/collection/1197440/400x400?sig=${encodeURIComponent(title)}`
                });
                resolve();
              }
            });
          });
        } catch {
          const title = url.split("/").pop() ?? "Unknown";
          loaded.push({
            id,
            title,
            artist: "Unknown artist",
            file: url,
            cover: `https://source.unsplash.com/collection/1197440/400x400?sig=${encodeURIComponent(title)}`
          });
        }
      }

      if (!cancelled) setSongs(loaded);
    }

    load();
    return () => { cancelled = true; };
  }, [publicFiles.join("|")]);

  return songs;
}