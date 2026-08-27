export type LiveDarshan = {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  channelId: string;
  startedAt?: string;
  watchingNow?: string;
  thumbnailUrl?: string;
  url?: string;
  embedUrl?: string;
  source?: 'youtube-live-search' | 'live-darshan-hub';
  sourcePage?: string;
};

export type LiveDarshanFeed = {
  items: LiveDarshan[];
  updatedAt?: string | null;
  stale?: boolean;
  source?: string;
};

// The production container serves this endpoint itself. Visitors never need a
// YouTube API key and the browser never tries to scrape youtube.com directly.
const FEED_URL = import.meta.env.VITE_LIVE_DARSHAN_FEED_URL || '/api/live-darshan';

export async function getLiveDarshans(signal?: AbortSignal): Promise<LiveDarshanFeed> {
  const separator = FEED_URL.includes('?') ? '&' : '?';
  const response = await fetch(`${FEED_URL}${separator}t=${Date.now()}`, {
    signal,
    cache: 'no-store',
  });
  const data = await response.json().catch(() => ({})) as Partial<LiveDarshanFeed> & { error?: string };

  if (!response.ok) {
    throw new Error(data.error || 'Live darshan search is temporarily unavailable.');
  }

  const unique = new Map<string, LiveDarshan>();
  (data.items || []).forEach((item) => {
    if (item?.videoId && item.title) unique.set(item.videoId, item);
  });

  return {
    items: [...unique.values()],
    updatedAt: data.updatedAt,
    stale: Boolean(data.stale),
    source: data.source,
  };
}
