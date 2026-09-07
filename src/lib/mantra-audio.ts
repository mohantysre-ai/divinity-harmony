export interface MantraAudioCandidate {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  durationText: string;
  url: string;
  embedUrl: string;
}

const searchCache = new Map<string, Promise<MantraAudioCandidate[]>>();

/**
 * Finds a YouTube recording for a mantra/stotra by title via the same-origin
 * /api/mantra-recordings endpoint. Results are cached for a day server-side.
 *
 * Used only as a fallback for mantras that don't yet have a curated
 * youtubeVideoId in mantras.json (see scripts/fetch-mantra-audio.mjs).
 */
export function searchMantraAudio(searchQuery: string): Promise<MantraAudioCandidate[]> {
  const query = searchQuery.trim();
  if (!query) return Promise.resolve([]);

  const cached = searchCache.get(query);
  if (cached) return cached;

  const promise = fetch(`/api/mantra-recordings?title=${encodeURIComponent(query)}`)
    .then((response) => (response.ok ? response.json() : null))
    .then((data: { items?: Array<MantraAudioCandidate & { duration?: string }> } | null) =>
      (data?.items ?? []).map((item) => ({
        ...item,
        durationText: item.durationText || item.duration || "",
      })),
    )
    .catch(() => []);

  searchCache.set(query, promise);
  return promise;
}

export async function resolveMantraAudio(searchQuery: string): Promise<MantraAudioCandidate | null> {
  return (await searchMantraAudio(searchQuery))[0] ?? null;
}

export function curatedMantraAudio(
  videoId: string | undefined,
  title: string,
  channelTitle?: string,
  durationText?: string,
): MantraAudioCandidate | null {
  if (!videoId) return null;
  return {
    videoId,
    title,
    channelTitle: channelTitle || "YouTube",
    durationText: durationText || "",
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0`,
  };
}
