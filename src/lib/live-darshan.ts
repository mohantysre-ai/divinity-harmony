export type LiveDarshan = {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  channelId: string;
  startedAt?: string;
};

type LiveFeed = { items?: LiveDarshan[] };

// Refreshed by the repository workflow, so visitors never need an API key.
const FEED_URL = import.meta.env.VITE_LIVE_DARSHAN_FEED_URL
  || 'https://raw.githubusercontent.com/mohantysre-ai/divinity-harmony/main/public/live-darshan-feed.json';

export async function getLiveDarshans(signal?: AbortSignal): Promise<LiveDarshan[]> {
  const response = await fetch(`${FEED_URL}?t=${Date.now()}`, { signal, cache: 'no-store' });
  if (!response.ok) throw new Error('Live darshan feed is temporarily unavailable.');
  const data = await response.json() as LiveFeed;
  const unique = new Map<string, LiveDarshan>();
  (data.items || []).forEach((item) => { if (item?.videoId) unique.set(item.videoId, item); });
  return [...unique.values()].sort((a, b) => (b.startedAt || '').localeCompare(a.startedAt || ''));
}
