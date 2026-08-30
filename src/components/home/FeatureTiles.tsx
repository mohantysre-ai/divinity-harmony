import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, Languages, Radio, Search, Sparkles, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import bundledData from '@/data/mantras.json';
import { sacredTexts } from '@/data/sacred-texts';
import { useLocale } from '@/hooks/use-locale';

type LivePayload = { items?: unknown[] };

const FeatureTiles = () => {
  const { tk } = useLocale();
  const [active, setActive] = useState(0);
  const [liveCount, setLiveCount] = useState<number | null>(null);

  const paths = useMemo(
    () => [
      {
        number: '01',
        eyebrow: tk('listenAndChant'),
        title: tk('sacredMantras'),
        text: tk('readSanskritJapa'),
        href: '/mantras',
        icon: Volume2,
        image: '/feature-mantras.svg',
        tone: 'from-orange-950/95 via-red-900/65 to-transparent',
        metric: `${bundledData.mantras.length}+`,
        metricLabel: tk('mantrasMetric'),
        action: tk('startListening'),
      },
      {
        number: '02',
        eyebrow: tk('templeBroadcasts'),
        title: tk('liveDarshan'),
        text: tk('enterTempleStreams'),
        href: '/darshan',
        icon: Radio,
        image: '/feature-darshan.svg',
        tone: 'from-purple-950/95 via-rose-900/65 to-transparent',
        metric: '—',
        metricLabel: tk('checkingLive'),
        action: tk('watchDarshan'),
      },
      {
        number: '03',
        eyebrow: tk('readReflect'),
        title: tk('sacredTexts'),
        text: tk('exploreVedasHeritage'),
        href: '/scriptures',
        icon: BookOpen,
        image: '/feature-scriptures.svg',
        tone: 'from-emerald-950/95 via-teal-900/65 to-transparent',
        metric: `${sacredTexts.length}+`,
        metricLabel: tk('worksMetric'),
        action: tk('openLibrary'),
      },
    ],
    [tk],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setActive((v) => (v + 1) % paths.length), 4200);
    return () => window.clearInterval(timer);
  }, [paths.length]);

  useEffect(() => {
    const controller = new AbortController();
    void fetch('/api/live-darshan', { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: LivePayload) => setLiveCount(d.items?.length ?? 0))
      .catch(() => setLiveCount(null));
    return () => controller.abort();
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-[#fff8ed] py-20 dark:bg-background sm:py-24">
        <div className="home-feature-glow absolute -left-32 top-28 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="container relative mx-auto px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">
              <Sparkles className="h-4 w-4" />
              {tk('yourSpiritualLibrary')}
            </p>
            <h2 className="mt-3 font-sanskrit text-3xl font-bold tracking-tight sm:text-5xl">{tk('threeLivingPaths')}</h2>
            <p className="mt-5 leading-7 text-muted-foreground">{tk('chooseSoundDarshan')}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {paths.map((path, index) => {
              const metric = index === 1 ? (liveCount == null ? '…' : String(liveCount)) : path.metric;
              const metricLabel =
                index === 1
                  ? liveCount && liveCount > 0
                    ? tk('liveNowLower')
                    : tk('streamsFound')
                  : path.metricLabel;

              return (
                <Link
                  key={path.title}
                  to={path.href}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  className={`home-feature-card group ${active === index ? 'is-active' : ''}`}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={path.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${path.tone}`} />
                    <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.16em] text-white backdrop-blur">
                      <path.icon className={`h-3.5 w-3.5 ${index === 1 && liveCount && liveCount > 0 ? 'animate-pulse text-red-300' : ''}`} />
                      {path.eyebrow}
                    </div>
                    <div className="absolute bottom-5 left-5 text-white">
                      <span className="text-3xl font-bold">{metric}</span>
                      <span className="ml-2 text-xs uppercase tracking-[.15em] text-white/65">{metricLabel}</span>
                    </div>
                    <span className="absolute right-5 top-5 text-xs font-bold tracking-[.22em] text-white/60">{path.number}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-sanskrit text-2xl font-bold">{path.title}</h3>
                        <p className="mt-3 min-h-14 text-sm leading-7 text-muted-foreground">{path.text}</p>
                      </div>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-900/10 text-orange-800 transition duration-300 group-hover:rotate-45 group-hover:bg-orange-700 group-hover:text-white">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-orange-950/10 pt-4">
                      <span className="text-sm font-semibold text-orange-800">{path.action}</span>
                      <span className="home-feature-progress h-1 w-16 overflow-hidden rounded-full bg-orange-950/10">
                        <span className="block h-full bg-orange-600" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-[#f5ead8] py-20 dark:bg-stone-900/60 sm:py-24">
        <div className="container mx-auto grid items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <div className="relative mx-auto aspect-square w-full max-w-md rounded-full border border-orange-900/15 p-8">
            <div className="home-lotus-grid flex h-full items-center justify-center rounded-full border border-orange-900/10 bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-950/40 dark:to-stone-950">
              <div className="text-center">
                <span className="block font-sanskrit text-7xl text-orange-800 dark:text-amber-400">ॐ</span>
                <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.3em] text-orange-900/60 dark:text-amber-200/60">{tk('listenReadReflect')}</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">{tk('designedAroundYou')}</p>
            <h2 className="mt-3 font-sanskrit text-3xl font-bold tracking-tight sm:text-5xl">{tk('findWhatSpeaks')}</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">{tk('moveNaturally')}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-orange-900/10 bg-white/65 p-5 backdrop-blur dark:bg-card/70">
                <Search className="h-5 w-5 text-orange-700" />
                <h3 className="mt-3 font-semibold">{tk('fastDiscovery')}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tk('searchHundredsResources')}</p>
              </div>
              <div className="rounded-2xl border border-orange-900/10 bg-white/65 p-5 backdrop-blur dark:bg-card/70">
                <Languages className="h-5 w-5 text-orange-700" />
                <h3 className="mt-3 font-semibold">{tk('sanskritAndEnglish')}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tk('originalTextContext')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeatureTiles;
