export type LiveSource = {
  channelId: string;
  name: string;
  temple: string;
  deity: string;
  location: string;
  officialUrl: string;
};

export type LiveDarshan = LiveSource & {
  videoId: string;
  title: string;
  description: string;
  startedAt?: string;
};

const API_ROOT = 'https://www.googleapis.com/youtube/v3/search';

async function getSources(): Promise<LiveSource[]> {
  const response = await fetch(import.meta.env.VITE_LIVE_DARSHAN_SOURCES_URL || '/live-darshan-sources.json');
  if (!response.ok) throw new Error('Unable to load the official temple registry.');
  const data = await response.json();
  const sources = Array.isArray(data) ? data : data.sources;
  if (!Array.isArray(sources)) throw new Error('Invalid official temple registry.');
  return sources.filter((source): source is LiveSource =>
    typeof source?.channelId === 'string' && typeof source?.name === 'string' &&
    typeof source?.temple === 'string' && typeof source?.officialUrl === 'string');
}

export async function getLiveDarshans(signal?: AbortSignal): Promise<LiveDarshan[]> {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY?.trim();
  if (!apiKey) throw new Error('Live verification is not configured yet.');
  const sources = await getSources();
  const checks = await Promise.all(sources.map(async (source) => {
    const params = new URLSearchParams({
      key: apiKey, part: 'snippet', channelId: source.channelId, eventType: 'live',
      type: 'video', maxResults: '5', order: 'date'
    });
    const response = await fetch(`${API_ROOT}?${params}`, { signal });
    if (!response.ok) return [];
    const data = await response.json();
    return (data.items || []).map((item: { id?: { videoId?: string }; snippet?: { title?: string; description?: string; publishedAt?: string } }) =>
      item.id?.videoId ? { ...source, videoId: item.id.videoId, title: item.snippet?.title || source.name,
        description: item.snippet?.description || `Live darshan from ${source.temple}`, startedAt: item.snippet?.publishedAt } : null
    ).filter(Boolean) as LiveDarshan[];
  }));
  return checks.flat().sort((a, b) => (b.startedAt || '').localeCompare(a.startedAt || ''));
}
