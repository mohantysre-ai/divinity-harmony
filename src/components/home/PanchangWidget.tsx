import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, CloudSun, Compass, Loader2, MapPin, MoonStar, Sparkles, Sunrise, Sunset } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';

type Panchang = {
  date: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  precision: string;
  paksha: string;
  moon_phase: string;
  weekday: string;
  nakshatra_index: number;
  tithi_index: number;
};

const glyphs = ['♈', '♉', '✦', '☾', '♊', '💧', '🏹', '✿', '🐍', '♌', '🛏', '☀', '✋', '◆', '🌿', '⚖', '🏺', '☂', '🌱', '🌊', '🐘', '👂', '🥁', '◯', '⚔', '♓', '🐟'];

export default function PanchangWidget() {
  const { tk } = useLocale();
  const [data, setData] = useState<Panchang | null>(null);
  const [locationUsed, setLocationUsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState('');

  const load = useCallback((lat?: number, lon?: number) => {
    setLoading(true);
    const params = new URLSearchParams({ date: new Date().toLocaleDateString('en-CA') });
    if (lat != null && lon != null) {
      params.set('lat', String(lat));
      params.set('lon', String(lon));
    }
    void fetch(`/api/panchang?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => load(), [load]);

  const localize = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError(tk('locationNotSupported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLocationUsed(true);
        load(p.coords.latitude, p.coords.longitude);
      },
      () => setLocationError(tk('locationPermissionDenied')),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 3600000 },
    );
  };

  const symbol = useMemo(() => glyphs[data?.nakshatra_index ?? 0] || '✦', [data]);

  const cards = data
    ? [
        {
          label: tk('nakshatra'),
          value: data.nakshatra,
          detail: tk('starOf27', { n: String(data.nakshatra_index + 1) }),
          icon: <span className="text-3xl">{symbol}</span>,
          color: 'from-violet-500/20 to-indigo-500/5',
        },
        {
          label: tk('tithi'),
          value: data.tithi,
          detail: data.paksha,
          icon: <MoonStar className="h-7 w-7" />,
          color: 'from-amber-500/20 to-orange-500/5',
        },
        {
          label: tk('yoga'),
          value: data.yoga,
          detail: tk('sunMoonCombination'),
          icon: <Sparkles className="h-7 w-7" />,
          color: 'from-rose-500/20 to-pink-500/5',
        },
        {
          label: tk('karana'),
          value: data.karana,
          detail: tk('halfTithiDivision'),
          icon: <Compass className="h-7 w-7" />,
          color: 'from-emerald-500/20 to-teal-500/5',
        },
      ]
    : [];

  return (
    <section className="relative overflow-hidden border-y border-orange-950/5 bg-[#fff8ed] py-12 text-foreground dark:border-white/5 dark:bg-[#2b0b12] dark:text-orange-50">
      <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_20%_10%,#f59e0b22,transparent_35%),radial-gradient(circle_at_90%_80%,#fb923c1f,transparent_38%)] dark:opacity-30" />
      <div className="container relative mx-auto px-5 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_1.9fr]">
          <div className="group relative min-h-[290px] overflow-hidden rounded-[2rem] border border-orange-300/20 shadow-2xl shadow-black/20">
            <img src="/panchang-orbit.svg" alt={tk('panchangCalendarAlt')} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.22em] text-amber-200">
                <CalendarDays className="h-4 w-4" />
                {tk('todaysPanchang')}
              </p>
              <h2 className="mt-2 text-3xl font-bold">{data?.weekday || tk('dailyCalendar')}</h2>
              <p className="mt-1 text-sm text-orange-100/80">
                {data
                  ? new Date(`${data.date}T12:00:00`).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : tk('loadingTodayDetails')}
              </p>
              <button
                onClick={localize}
                className="mt-4 inline-flex items-center rounded-full border border-orange-200/30 bg-black/20 px-4 py-2 text-xs font-medium backdrop-blur transition hover:-translate-y-0.5 hover:bg-orange-500/30"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <MapPin className="mr-2 h-3.5 w-3.5" />
                )}
                {locationUsed ? tk('panchangLocalized') : tk('useMyLocation')}
              </button>
            </div>
          </div>
          <div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map((c, i) => (
                <article
                  key={c.label}
                  style={{ animationDelay: `${i * 90}ms` }}
                  className={`animate-fade-in rounded-3xl border border-orange-950/10 bg-gradient-to-br ${c.color} p-5 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl dark:border-white/10`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-orange-700 shadow-sm dark:bg-white/10 dark:text-amber-200">{c.icon}</div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[.18em] text-orange-700/75 dark:text-orange-200/70">{c.label}</p>
                  <h3 className="mt-1 text-lg font-bold">{c.value}</h3>
                  <p className="mt-1 text-xs text-muted-foreground dark:text-orange-100/60">{c.detail}</p>
                </article>
              ))}
            </div>
            {data && (
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-orange-950/10 bg-white/75 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <span className="flex items-center gap-2 text-xs font-medium text-orange-700 dark:text-orange-200">
                    <Sunrise className="h-4 w-4" />
                    {tk('sunrise')}
                  </span>
                  <strong className="mt-1 block text-xl">{data.sunrise}</strong>
                </div>
                <div className="rounded-2xl border border-orange-950/10 bg-white/75 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <span className="flex items-center gap-2 text-xs font-medium text-orange-700 dark:text-orange-200">
                    <Sunset className="h-4 w-4" />
                    {tk('sunset')}
                  </span>
                  <strong className="mt-1 block text-xl">{data.sunset}</strong>
                </div>
                <div className="rounded-2xl border border-orange-950/10 bg-white/75 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <span className="flex items-center gap-2 text-xs font-medium text-orange-700 dark:text-orange-200">
                    <CloudSun className="h-4 w-4" />
                    {tk('moon')}
                  </span>
                  <strong className="mt-1 block text-xl">{data.moon_phase}</strong>
                </div>
              </div>
            )}
            {locationError && <p className="mt-3 text-xs text-amber-800 dark:text-amber-200">{locationError}</p>}
            {data && <p className="mt-4 text-[11px] leading-5 text-muted-foreground dark:text-orange-100/55">{data.precision}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
