export type LiveDarshan = {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  channelId: string;
  startedAt?: string;
  embedUrl?: string;
  source?: 'discovered' | 'channel';
};

type LiveFeed = { items?: LiveDarshan[] };

// Refreshed by the repository workflow, so visitors never need an API key.
const FEED_URL = import.meta.env.VITE_LIVE_DARSHAN_FEED_URL
  || 'https://raw.githubusercontent.com/mohantysre-ai/divinity-harmony/main/public/live-darshan-feed.json';

// These are live-channel endpoints, not recorded-video links. YouTube resolves
// the channel's current broadcast whenever a devotee opens one.
const LIVE_CHANNELS: LiveDarshan[] = [
  { title: 'Shirdi Sai Baba Live Darshan', channelId: 'UCoj525WIszT7Mnp7seDPsTA' },
  { title: 'Shree Somnath Temple Live Darshan', channelId: 'UCT1egsvA08YcdMLiEu1DTRg' },
  { title: 'Shree Siddhivinayak Temple Live Darshan', channelId: 'UCF9FdiMBENIbM6jb44zWmCQ' },
  { title: 'ISKCON Juhu Mumbai Live Darshan', channelId: 'UC1vJ4RlWSHP6n0xL2G1tkYQ' },
  { title: 'Kalupur Swaminarayan Mandir Live Darshan', channelId: 'UCSOO8aliEwUKxIVkk5Igz-A' },
].map(({ title, channelId }) => ({
  videoId: `channel-${channelId}`,
  title,
  description: 'Current live stream from this temple channel when it is broadcasting.',
  channelTitle: title,
  channelId,
  embedUrl: `https://www.youtube-nocookie.com/embed/live_stream?channel=${channelId}&autoplay=1&rel=0`,
  source: 'channel' as const,
}));

export async function getLiveDarshans(signal?: AbortSignal): Promise<LiveDarshan[]> {
  const response = await fetch(`${FEED_URL}?t=${Date.now()}`, { signal, cache: 'no-store' });
  if (!response.ok) throw new Error('Live darshan feed is temporarily unavailable.');
  const data = await response.json() as LiveFeed;
  const unique = new Map<string, LiveDarshan>();
  (data.items || []).forEach((item) => { if (item?.videoId) unique.set(item.videoId, item); });
  const discovered = [...unique.values()].sort((a, b) => (b.startedAt || '').localeCompare(a.startedAt || ''));
  return discovered.length ? discovered : LIVE_CHANNELS;
}
