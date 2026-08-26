export type LiveDarshan = {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  channelId: string;
  startedAt?: string;
};

const API_ROOT = 'https://www.googleapis.com/youtube/v3/search';
const DEFAULT_QUERIES = ['live temple darshan', 'live mandir darshan', 'live temple aarti', 'live darshan India'];

function queries() {
  const configured = import.meta.env.VITE_LIVE_DARSHAN_QUERIES?.split(',').map((item) => item.trim()).filter(Boolean);
  return configured?.length ? configured : DEFAULT_QUERIES;
}

export async function getLiveDarshans(apiKey?: string, signal?: AbortSignal): Promise<LiveDarshan[]> {
  apiKey = apiKey?.trim() || import.meta.env.VITE_YOUTUBE_API_KEY?.trim();
  if (!apiKey) throw new Error('Live discovery is not configured yet.');
  const results = await Promise.all(queries().map(async (query) => {
    const params = new URLSearchParams({ key: apiKey, part: 'snippet', q: query, eventType: 'live', type: 'video', maxResults: '50', order: 'date' });
    const response = await fetch(`${API_ROOT}?${params}`, { signal });
    if (!response.ok) throw new Error('YouTube live discovery is temporarily unavailable.');
    const data = await response.json();
    return (data.items || []).map((item: { id?: { videoId?: string }; snippet?: { title?: string; description?: string; channelTitle?: string; channelId?: string; publishedAt?: string } }) =>
      item.id?.videoId ? { videoId: item.id.videoId, title: item.snippet?.title || 'Live Temple Darshan',
        description: item.snippet?.description || 'Live darshan stream', channelTitle: item.snippet?.channelTitle || 'YouTube channel',
        channelId: item.snippet?.channelId || '', startedAt: item.snippet?.publishedAt } : null
    ).filter(Boolean) as LiveDarshan[];
  }));
  const unique = new Map<string, LiveDarshan>();
  results.flat().forEach((item) => unique.set(item.videoId, item));
  return [...unique.values()].sort((a, b) => (b.startedAt || '').localeCompare(a.startedAt || ''));
}
