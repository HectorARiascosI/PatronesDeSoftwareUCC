export interface SongMeta {
  id: string;
  title: string;
  artist: string;
  album?: string;
  cover?: string;
  file: string; // URL del objeto de audio
}