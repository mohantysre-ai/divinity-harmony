import { useCallback, useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from '@/hooks/use-theme';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Radio, RefreshCw, Youtube } from 'lucide-react';
import { getLiveDarshans, type LiveDarshan as LiveDarshanItem } from '@/lib/live-darshan';
import { useLocale } from '@/hooks/use-locale';

const POLL_MS = 5 * 60 * 1000;

const LiveDarshan = () => {
  const { locale } = useLocale();
  const [darshans, setDarshans] = useState<LiveDarshanItem[]>([]);
  const [selected, setSelected] = useState<LiveDarshanItem | null>(null);
  const [message, setMessage] = useState('Searching live temple sources...');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const feed = await getLiveDarshans();
      const live = feed.items;
      setDarshans(live);
      setSelected((current) => live.find((item) => item.videoId === current?.videoId) || live[0] || null);
      if (live.length) {
        setMessage(
          `${live.length} stream${live.length === 1 ? '' : 's'} currently marked LIVE across connected sources${feed.stale ? ' (last successful search)' : ''}.`,
        );
      } else {
        setMessage('Connected sources currently report no matching live temple stream. This page will search again automatically.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to search live streams right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => void refresh(), POLL_MS);
    return () => window.clearInterval(interval);
  }, [refresh]);

  return (
    <ThemeProvider>
      <Layout>
        <main className="container mx-auto py-8">
          <div className="mb-8 text-center">
            <div className="mb-2 flex justify-center gap-2 text-sm font-semibold text-red-600">
              <Radio className="h-4 w-4 animate-pulse" />
              LIVE NOW <span aria-hidden="true">•</span> MULTI-SOURCE DISCOVERY
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">Live Temple Darshan</h1>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Current streams are discovered from YouTube live search and the LiveDarshanHub temple directory. There
              is no visitor API key, duplicate streams are removed, and results refresh every five minutes.
            </p>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" onClick={() => void refresh()} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh live status
              </Button>
            </div>
          </div>

          <p role="status" className="mb-5 text-center text-sm text-muted-foreground">
            {message}
          </p>

          {selected ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <section className="overflow-hidden rounded-xl bg-card shadow-lg lg:col-span-2">
                <div className="relative aspect-video">
                  <iframe
                    key={selected.videoId}
                    src={`${selected.embedUrl || `https://www.youtube-nocookie.com/embed/${selected.videoId}?autoplay=1&rel=0`}${(selected.embedUrl || '').includes('?') ? '&' : selected.embedUrl ? '?' : '&'}hl=${locale}`}
                    title={selected.title}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold">{selected.title}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    <span>{selected.channelTitle}</span>
                    {selected.watchingNow && <span>{selected.watchingNow}</span>}
                  </div>
                  {selected.description && <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{selected.description}</p>}
                  <p className="mt-3 text-xs text-muted-foreground">
                    This stream was marked LIVE by {selected.source === 'live-darshan-hub' ? 'LiveDarshanHub' : 'YouTube'} at the last refresh.
                    {' '}Use judgement before donations or transactions.
                  </p>
                </div>
              </section>

              <aside className="lg:col-span-1">
                <h2 className="mb-4 text-xl font-bold">Live now ({darshans.length})</h2>
                <div className="max-h-[680px] space-y-3 overflow-auto pr-2">
                  {darshans.map((item) => (
                    <Card
                      key={item.videoId}
                      onClick={() => setSelected(item)}
                      className={`cursor-pointer overflow-hidden transition-colors ${
                        selected.videoId === item.videoId ? 'border-primary ring-1 ring-primary' : ''
                      }`}
                    >
                      <CardContent className="flex gap-3 p-3">
                        {item.thumbnailUrl && (
                          <img
                            src={item.thumbnailUrl}
                            alt=""
                            loading="lazy"
                            className="h-20 w-32 flex-none rounded-md object-cover"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="flex items-center gap-1 text-xs font-bold text-red-600">
                            <Radio className="h-3 w-3" /> LIVE
                          </p>
                          <h3 className="mt-1 line-clamp-2 text-sm font-medium">{item.title}</h3>
                          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{item.channelTitle}</p>
                          {item.watchingNow && (
                            <p className="line-clamp-1 text-xs text-muted-foreground">{item.watchingNow}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </aside>
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-xl border border-dashed bg-card p-8 text-center">
              <Youtube className="mx-auto mb-3 h-8 w-8 text-red-600" />
              <h2 className="font-semibold">{loading ? 'Searching current live streams...' : 'No live result available'}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            </div>
          )}
        </main>
      </Layout>
    </ThemeProvider>
  );
};

export default LiveDarshan;
