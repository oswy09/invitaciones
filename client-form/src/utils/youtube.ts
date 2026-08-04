// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface YouTubeSearchResult {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  duration?: string;
}

// ─── Catálogo local de respaldo (~25 canciones) ────────────────────────────────

export const POPULAR_CATALOG: (YouTubeSearchResult & { genre: string })[] = [
  { id: "450p7ec_KZI", title: "Perfect", artist: "Ed Sheeran", genre: "romantica boda amor", thumbnailUrl: "", youtubeUrl: "" },
  { id: "JGwWNGJdvx8", title: "Shape of You", artist: "Ed Sheeran", genre: "pop fiesta boda", thumbnailUrl: "", youtubeUrl: "" },
  { id: "rtOvBOTyX00", title: "All of Me", artist: "John Legend", genre: "romantica boda amor piano", thumbnailUrl: "", youtubeUrl: "" },
  { id: "hT_nvWreIhg", title: "Counting Stars", artist: "OneRepublic", genre: "pop fiesta", thumbnailUrl: "", youtubeUrl: "" },
  { id: "lp-Ejc7c4dI", title: "Photograph", artist: "Ed Sheeran", genre: "romantica boda amor", thumbnailUrl: "", youtubeUrl: "" },
  { id: "nfWlot6h_JM", title: "Shakira: Shakira", artist: "Shakira ft. Bizarrap", genre: "pop latina fiesta", thumbnailUrl: "", youtubeUrl: "" },
  { id: "kTJczUoc26U", title: "Hawái", artist: "Maluma", genre: "reggaeton latina fiesta", thumbnailUrl: "", youtubeUrl: "" },
  { id: "pRpeEdMmmQ0", title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", genre: "reggaeton latina fiesta", thumbnailUrl: "", youtubeUrl: "" },
  { id: "ALILG8NpGSQ", title: "La Bachata", artist: "Manuel Turizo", genre: "bachata latina fiesta", thumbnailUrl: "", youtubeUrl: "" },
  { id: "RgKAFK5djSk", title: "See You Again", artist: "Wiz Khalifa ft. Charlie Puth", genre: "pop balada emocional", thumbnailUrl: "", youtubeUrl: "" },
  { id: "ru0K8uYEZWw", title: "Can't Stop the Feeling!", artist: "Justin Timberlake", genre: "pop fiesta cumpleaños alegre", thumbnailUrl: "", youtubeUrl: "" },
  { id: "CevxZvSJLk8", title: "Katy Perry - Roar", artist: "Katy Perry", genre: "pop fiesta motivacional", thumbnailUrl: "", youtubeUrl: "" },
  { id: "OPf0YbXqDm0", title: "Happy", artist: "Pharrell Williams", genre: "pop alegre fiesta cumpleaños", thumbnailUrl: "", youtubeUrl: "" },
  { id: "09R8_2nJtjg", title: "Sugar", artist: "Maroon 5", genre: "pop fiesta amor", thumbnailUrl: "", youtubeUrl: "" },
  { id: "YnopHCL1Jk8", title: "Una Lady Como Tú", artist: "MTZ Manuel Turizo", genre: "latina baby shower celebracion", thumbnailUrl: "", youtubeUrl: "" },
  { id: "LjhCEhWiKXk", title: "Bésame", artist: "Camilo", genre: "pop latina baby shower", thumbnailUrl: "", youtubeUrl: "" },
  { id: "IcrbM1l_BoI", title: "Vida de Rico", artist: "Camilo", genre: "pop latina fiesta", thumbnailUrl: "", youtubeUrl: "" },
  { id: "_3NcVNRz4-c", title: "Tattoo", artist: "Rauw Alejandro", genre: "reggaeton latina fiesta", thumbnailUrl: "", youtubeUrl: "" },
  { id: "7wtfhZwyrcc", title: "Flowers", artist: "Miley Cyrus", genre: "pop boda amor", thumbnailUrl: "", youtubeUrl: "" },
  { id: "h_D3VFfhvs4", title: "Stay With Me", artist: "Sam Smith", genre: "pop romantica boda", thumbnailUrl: "", youtubeUrl: "" },
  { id: "60ItHLz5WEA", title: "A Thousand Years", artist: "Christina Perri", genre: "romantica boda amor piano", thumbnailUrl: "", youtubeUrl: "" },
  { id: "Ho9_F1LTUWI", title: "Mil Años", artist: "Carlos Rivera", genre: "romantica boda amor", thumbnailUrl: "", youtubeUrl: "" },
  { id: "MkLSKJiHnuE", title: "Beso", artist: "Camilo & El Alfa", genre: "latina baby shower fiesta", thumbnailUrl: "", youtubeUrl: "" },
  { id: "SlPhMPnQ58k", title: "Baby Shark", artist: "Pinkfong", genre: "niños baby shower cumpleaños", thumbnailUrl: "", youtubeUrl: "" },
  { id: "FTQbiNvZqaY", title: "Amor Prohibido", artist: "Selena", genre: "cumbia latina clasico", thumbnailUrl: "", youtubeUrl: "" },
].map(s => ({
  ...s,
  thumbnailUrl: `https://i.ytimg.com/vi/${s.id}/hqdefault.jpg`,
  youtubeUrl: `https://www.youtube.com/watch?v=${s.id}`,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const YT_ID_REGEX = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;

export function extractYouTubeId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim();
  // ID directo de 11 caracteres
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(YT_ID_REGEX);
  return match?.[2]?.length === 11 ? match[2] : null;
}

export async function fetchYouTubeVideoInfo(
  urlOrId: string
): Promise<{ id: string; title: string; author: string } | null> {
  const id = extractYouTubeId(urlOrId);
  if (!id) return null;
  try {
    const res = await fetch(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`,
      { signal: AbortSignal.timeout(3000) }
    );
    const data = await res.json();
    if (data?.title) {
      return { id, title: data.title, author: data.author_name ?? "" };
    }
  } catch {}
  return { id, title: `Video ${id}`, author: "" };
}

// ─── Búsqueda principal (3 capas) ────────────────────────────────────────────

const PIPED_INSTANCES = [
  "https://pipedapi.kavin.rocks",
  "https://api.piped.private.coffee",
  "https://pipedapi.tokhmi.xyz",
];

async function searchViaPiped(query: string): Promise<YouTubeSearchResult[]> {
  for (const base of PIPED_INSTANCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(
        `${base}/search?q=${encodeURIComponent(query)}&filter=music_songs`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);
      if (!res.ok) continue;
      const data = await res.json();
      const items: YouTubeSearchResult[] = (data.items ?? [])
        .filter((item: any) => item.type === "video" || item.type === "stream")
        .slice(0, 12)
        .map((item: any) => {
          const rawId: string = (item.url ?? "").replace("/watch?v=", "");
          const id = rawId.length === 11 ? rawId : "";
          return {
            id,
            title: item.title ?? "",
            artist: item.uploaderName ?? item.uploader ?? "",
            thumbnailUrl: item.thumbnail?.startsWith("http")
              ? item.thumbnail
              : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
            youtubeUrl: `https://www.youtube.com/watch?v=${id}`,
            duration: item.duration ? formatDuration(item.duration) : undefined,
          };
        })
        .filter((r: YouTubeSearchResult) => r.id.length === 11);
      if (items.length > 0) return items;
    } catch {}
  }
  return [];
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function searchLocalCatalog(query: string): YouTubeSearchResult[] {
  const q = query.toLowerCase();
  const filtered = POPULAR_CATALOG.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.genre.toLowerCase().includes(q)
  );
  return (filtered.length > 0 ? filtered : POPULAR_CATALOG.slice(0, 8)).map(
    ({ genre: _g, ...rest }) => rest
  );
}

export async function searchYouTubeSongs(query: string): Promise<YouTubeSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return POPULAR_CATALOG.slice(0, 8).map(({ genre: _g, ...r }) => r);

  // CAPA 1: URL o ID directo de YouTube
  const directId = extractYouTubeId(trimmed);
  if (directId) {
    const info = await fetchYouTubeVideoInfo(directId);
    if (info) {
      return [
        {
          id: info.id,
          title: info.title,
          artist: info.author,
          thumbnailUrl: `https://i.ytimg.com/vi/${info.id}/hqdefault.jpg`,
          youtubeUrl: `https://www.youtube.com/watch?v=${info.id}`,
        },
      ];
    }
  }

  // CAPA 2: Piped API
  try {
    const pipedResults = await searchViaPiped(trimmed);
    if (pipedResults.length > 0) return pipedResults;
  } catch {}

  // CAPA 3: Catálogo local
  return searchLocalCatalog(trimmed);
}
