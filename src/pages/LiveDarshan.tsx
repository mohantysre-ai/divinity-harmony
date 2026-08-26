import React, { useCallback, useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from '@/hooks/use-theme';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KeyRound, Radio, RefreshCw, Youtube } from 'lucide-react';
import { getLiveDarshans, type LiveDarshan } from '@/lib/live-darshan';
import { Input } from '@/components/ui/input';

const POLL_MS = 5 * 60 * 1000;
const STORAGE_KEY = 'divinity-harmony-youtube-api-key';
const LiveDarshan = () => {
  const [darshans, setDarshans] = useState<LiveDarshan[]>([]);
  const [selected, setSelected] = useState<LiveDarshan | null>(null);
  const [message, setMessage] = useState('Searching YouTube for live temple darshanâ¦');
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState(() => import.meta.env.VITE_YOUTUBE_API_KEY?.trim() || window.localStorage.getItem(STORAGE_KEY) || '');
  const [keyDraft, setKeyDraft] = useState(apiKey);
  const [showSetup, setShowSetup] = useState(false);
  const refresh = useCallback(async () => {
    setLoading(true);
    try { const live = await getLiveDarshans(apiKey); setDarshans(live); setSelected((current) => live.find((item) => item.videoId === current?.videoId) || live[0] || null); setMessage(live.length ? `${live.length} live darshan stream${live.length === 1 ? '' : 's'} found now.` : 'No matching YouTube stream is live right now. This page refreshes automatically.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to discover live streams.'); }
    finally { setLoading(false); }
  }, [apiKey]);
  useEffect(() => { void refresh(); const interval = window.setInterval(() => void refresh(), POLL_MS); return () => window.clearInterval(interval); }, [refresh]);
  return <ThemeProvider><Layout><main className="container mx-auto py-8">
    <div className="mb-8 text-center"><div className="mb-2 flex justify-center gap-2 text-sm font-semibold text-red-600"><Radio className="h-4 w-4 animate-pulse" /> LIVE NOW Â· COMMUNITY DISCOVERY</div><h1 className="text-3xl font-bold md:text-4xl">Live Temple Darshan</h1><p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Every stream shown is currently reported live by YouTube for temple/darshan searches. Results are dynamic, have no fixed catalog limit, and refresh every five minutes.</p><div className="mt-4 flex justify-center"><Button variant="outline" onClick={() => void refresh()} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh live status</Button></div></div>
    <p role="status" className="mb-5 text-center text-sm text-muted-foreground">{message}</p>
    {!import.meta.env.VITE_YOUTUBE_API_KEY && <div className="mx-auto mb-6 max-w-2xl rounded-xl border bg-card p-4 text-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 font-medium"><KeyRound className="h-4 w-4 text-primary" />Live discovery setup</div><Button size="sm" variant="outline" onClick={() => setShowSetup((value) => !value)}>{showSetup ? 'Hide setup' : apiKey ? 'Change key' : 'Add key'}</Button></div>{showSetup && <div className="mt-4"><p className="mb-3 text-muted-foreground">Paste a YouTube Data API v3 browser key. It is saved only in this browser; restrict it to this appâs domain in Google Cloud.</p><div className="flex flex-col gap-2 sm:flex-row"><Input type="password" value={keyDraft} onChange={(event) => setKeyDraft(event.target.value.trim())} placeholder="YouTube Data API key" aria-label="YouTube Data API key" /><Button onClick={() => { window.localStorage.setItem(STORAGE_KEY, keyDraft); setApiKey(keyDraft); }}>Save and search</Button></div></div>}</div>}
    {selected ? <div className="grid grid-cols-1 gap-8 lg:grid-cols-3"><section className="lg:col-span-2 overflow-hidden rounded-xl bg-card shadow-lg"><div className="relative aspect-video"><iframe key={selected.videoId} src={`https://www.youtube-nocookie.com/embed/${selected.videoId}?autoplay=1&rel=0`} title={selected.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full border-0" /></div><div className="p-6"><h2 className="text-2xl font-bold">{selected.title}</h2><p className="mt-2 text-muted-foreground">{selected.channelTitle}</p><p className="mt-3 text-xs text-muted-foreground">Live status comes from YouTube at refresh time. Community-discovered stream; please use judgement before donations or transactions.</p></div></section><aside className="lg:col-span-1"><h2 className="mb-4 text-xl font-bold">Live now</h2><div className="max-h-[600px] space-y-3 overflow-auto pr-2">{darshans.map((item) => <Card key={item.videoId} onClick={() => setSelected(item)} className={`cursor-pointer ${selected.videoId === item.videoId ? 'border-primary ring-1 ring-primary' : ''}`}><CardContent className="p-4"><p className="flex items-center gap-2 text-xs font-bold text-red-600"><Radio className="h-3 w-3" />LIVE</p><h3 className="mt-1 line-clamp-2 font-medium">{item.title}</h3><p className="line-clamp-1 text-xs text-muted-foreground">{item.channelTitle}</p></CardContent></Card>)}</div></aside></div> : <div className="mx-auto max-w-xl rounded-xl border border-dashed bg-card p-8 text-center"><Youtube className="mx-auto mb-3 h-8 w-8 text-red-600" /><h2 className="font-semibold">No matching stream is live now</h2><p className="mt-2 text-sm text-muted-foreground">New live temple links are found automatically whenever YouTube reports them as live.</p></div>}
  </main></Layout></ThemeProvider>;
};
export default LiveDarshan;
