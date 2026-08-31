import { useMemo, useState } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from '@/hooks/use-theme';
import { useLocale } from '@/hooks/use-locale';
import { temples, type Temple } from '@/data/temples';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const distance = (a: number, b: number, c: number, d: number) => {
  const r = 6371;
  const p = Math.PI / 180;
  const x =
    Math.sin(((c - a) * p) / 2) ** 2 +
    Math.cos(a * p) * Math.cos(c * p) * Math.sin(((d - b) * p) / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(x));
};
const mapUrl = (temple: Temple) => {
  const delta = 0.035;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${temple.lon - delta}%2C${temple.lat - delta}%2C${temple.lon + delta}%2C${temple.lat + delta}&layer=mapnik&marker=${temple.lat}%2C${temple.lon}`;
};

export default function TemplesPage() {
  const { tk, lc } = useLocale();
  const [query, setQuery] = useState('');
  const [position, setPosition] = useState<{ lat: number; lon: number } | null>(null);
  const [selected, setSelected] = useState<Temple>(temples[0]);
  const list = useMemo(
    () =>
      temples
        .map((temple) => ({
          ...temple,
          distance: position
            ? distance(position.lat, position.lon, temple.lat, temple.lon)
            : null,
        }))
        .filter((temple) => {
          const haystack = [
            lc(temple.name),
            lc(temple.deity),
            lc(temple.city),
            lc(temple.state),
            temple.name,
            temple.deity,
            temple.city,
            temple.state,
          ]
            .join(' ')
            .toLowerCase();
          return haystack.includes(query.toLowerCase());
        })
        .sort((a, b) => (a.distance ?? 99999) - (b.distance ?? 99999)),
    [query, position],
  );
  return (
    <ThemeProvider>
      <Layout>
        <main className="container mx-auto px-4 py-10">
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-orange-700">
            {tk('sacredGeography')}
          </p>
          <h1 className="mt-2 text-4xl font-bold">{tk('temples')}</h1>
          <p className="mt-3 text-muted-foreground">{tk('templeLocatorDesc')}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-9"
                placeholder={tk('searchTemplePlaceholder')}
              />
            </div>
            <Button
              onClick={() =>
                navigator.geolocation?.getCurrentPosition((point) =>
                  setPosition({ lat: point.coords.latitude, lon: point.coords.longitude }),
                )
              }
            >
              <Navigation className="mr-2 h-4 w-4" />
              {tk('findNearMe')}
            </Button>
          </div>
          <section className="mt-8 overflow-hidden rounded-2xl border bg-card">
            <iframe
              title={tk('mapOfTempleTemplate', { name: lc(selected.name) })}
              src={mapUrl(selected)}
              className="h-[360px] w-full border-0"
              loading="lazy"
            />
            <div className="p-4">
              <strong>{lc(selected.name)}</strong>
              <span className="ml-2 text-sm text-muted-foreground">
                {lc(selected.city)}, {lc(selected.state)}
              </span>
            </div>
          </section>
          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {list.map((temple) => (
              <button
                type="button"
                key={temple.id}
                onClick={() => setSelected(temple)}
                className={`rounded-2xl border bg-card p-6 text-left shadow-sm transition hover:-translate-y-1 ${selected.id === temple.id ? 'border-orange-600 ring-1 ring-orange-600' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <Badge>{lc(temple.type)}</Badge>
                  {temple.distance != null && (
                    <span className="text-xs text-muted-foreground">{Math.round(temple.distance)} km</span>
                  )}
                </div>
                <h2 className="mt-5 text-xl font-bold">{lc(temple.name)}</h2>
                <p className="mt-2 text-sm text-orange-700">{lc(temple.deity)}</p>
                <p className="mt-3 flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {lc(temple.city)}, {lc(temple.state)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tk('typicalHoursLabel')}: {lc(temple.timings)}
                </p>
              </button>
            ))}
          </section>
          <p className="mt-8 text-xs text-muted-foreground">{tk('mapAttribution')}</p>
        </main>
      </Layout>
    </ThemeProvider>
  );
}
