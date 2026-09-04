import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BookOpenCheck,
  CalendarDays,
  ExternalLink,
  Globe2,
  Hotel,
  MapPin,
  Navigation,
  Plane,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  TrainFront,
} from "lucide-react";

import Layout from "@/components/layout/Layout";
import ResilientCoverImage from "@/components/ResilientCoverImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeProvider } from "@/hooks/use-theme";
import { useLocale } from "@/hooks/use-locale";
import { temples, type Temple } from "@/data/temples";

const distance = (a: number, b: number, c: number, d: number) => {
  const radius = 6371;
  const radians = Math.PI / 180;
  const value =
    Math.sin(((c - a) * radians) / 2) ** 2 +
    Math.cos(a * radians) *
      Math.cos(c * radians) *
      Math.sin(((d - b) * radians) / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(value));
};

const mapUrl = (temple: Temple) => {
  const delta = 0.035;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${temple.lon - delta}%2C${temple.lat - delta}%2C${temple.lon + delta}%2C${temple.lat + delta}&layer=mapnik&marker=${temple.lat}%2C${temple.lon}`;
};

const searchUrl = (query: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(query)}`;
const mapsUrl = (temple: Temple) =>
  `https://www.google.com/maps/dir/?api=1&destination=${temple.lat},${temple.lon}`;

function tourismSearch(temple: Temple) {
  if (temple.tourismUrl) return temple.tourismUrl;
  const domain =
    temple.country === "India"
      ? "incredibleindia.gov.in"
      : temple.country === "Indonesia"
        ? "indonesia.travel"
        : "whc.unesco.org";
  return searchUrl(`site:${domain} ${temple.name} ${temple.country}`);
}

export default function TemplesPage() {
  const { tk, lc, lcl } = useLocale();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("search") || "");
  const [position, setPosition] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [remote, setRemote] = useState<Temple[]>([]);
  const [selected, setSelected] = useState<Temple>(temples[0]);
  const [searching, setSearching] = useState(false);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setRemote([]);
      setSearching(false);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setSearching(true);
      void fetch(`/api/temples/search?q=${encodeURIComponent(term)}`, {
        signal: controller.signal,
      })
        .then((response) =>
          response.ok ? response.json() : Promise.reject(new Error()),
        )
        .then((payload) => setRemote(payload.items || []))
        .catch((error) => {
          if (error.name !== "AbortError") setRemote([]);
        })
        .finally(() => setSearching(false));
    }, 450);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  const list = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    const local = temples.filter((temple) => {
      if (!needle) return true;
      return [
        lc(temple.name),
        lc(temple.deity),
        lc(temple.city),
        lc(temple.state),
        lc(temple.country),
        temple.name,
        temple.deity,
        temple.city,
        temple.state,
        temple.country,
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(needle);
    });
    const identities = new Set(local.map((temple) => temple.name.toLowerCase()));
    const merged = [
      ...local,
      ...remote.filter((temple) => !identities.has(temple.name.toLowerCase())),
    ];
    return merged
      .map((temple) => ({
        ...temple,
        distance: position
          ? distance(position.lat, position.lon, temple.lat, temple.lon)
          : null,
      }))
      .sort((left, right) =>
        position
          ? (left.distance ?? 99999) - (right.distance ?? 99999)
          : Number(Boolean(left.discovered)) - Number(Boolean(right.discovered)),
      );
  }, [query, position, remote, lc]);

  useEffect(() => {
    if (query.trim() && list.length) setSelected(list[0]);
  }, [query, list]);

  const locate = () => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Location is unavailable in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (point) => {
        const next = {
          lat: point.coords.latitude,
          lon: point.coords.longitude,
        };
        setPosition(next);
        setSearching(true);
        void fetch(
          `/api/temples/nearby?lat=${next.lat}&lon=${next.lon}`,
        )
          .then((response) =>
            response.ok ? response.json() : Promise.reject(new Error()),
          )
          .then((payload) => {
            const items = (payload.items || []) as Temple[];
            setRemote(items);
            if (items[0]) setSelected(items[0]);
          })
          .catch(() =>
            setLocationError(
              "Your location was found, but nearby community map results are temporarily unavailable.",
            ),
          )
          .finally(() => setSearching(false));
      },
      () =>
        setLocationError(
          "Allow location access to discover small temples around you.",
        ),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 3600000 },
    );
  };

  const actions = [
    {
      label: "Directions",
      detail: "Door-to-temple route",
      icon: Navigation,
      url: mapsUrl(selected),
    },
    {
      label: "Flights",
      detail: selected.nearestAirport || "Search the nearest airport",
      icon: Plane,
      url: searchUrl(`flights to ${selected.city} ${selected.country}`),
    },
    {
      label: "Stay nearby",
      detail: "Compare current rooms",
      icon: Hotel,
      url: searchUrl(`hotels near ${selected.name} ${selected.city}`),
    },
    {
      label: "Tour packages",
      detail: "Compare current pilgrimage plans",
      icon: TicketCheck,
      url: searchUrl(
        `${selected.name} ${selected.city} pilgrimage tour package from my city`,
      ),
    },
    {
      label: "Official travel guide",
      detail: "Government, temple or UNESCO source",
      icon: Globe2,
      url: tourismSearch(selected),
    },
    {
      label: "Local transport",
      detail: selected.railOrRoad || "Rail, bus and road options",
      icon: TrainFront,
      url: searchUrl(
        `how to reach ${selected.name} ${selected.city} public transport`,
      ),
    },
  ];

  const preparation = [
    "Recheck opening hours, special darshan rules and festival closures on the day before travel.",
    "Use only official temple counters or clearly identified authorized channels for tickets, seva and donations.",
    "Confirm dress, footwear, photography, luggage, food and entry restrictions for every family member.",
    "Plan medicines, hydration, accessibility, queue time, local weather and emergency contacts for elders and children.",
    selected.country !== "India"
      ? "Check passport validity, visa or entry rules, travel insurance, currency, roaming and local customs."
      : "Keep identity documents, booking confirmations and an offline copy of the route.",
  ];

  return (
    <ThemeProvider>
      <Layout>
        <main className="container mx-auto px-4 py-10">
          <section className="relative overflow-hidden rounded-[2rem] border bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 p-7 dark:from-orange-950/30 dark:via-background dark:to-rose-950/20 md:p-10">
            <Globe2 className="absolute -right-6 -top-6 h-40 w-40 text-orange-200/40" />
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-orange-700">
              {tk("sacredGeography")}
            </p>
            <h1 className="mt-2 text-4xl font-bold">{tk("temples")}</h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              {lc(
                "Search curated pilgrimage guides and community-mapped Hindu temples across India and the world. Every result opens into a travel, darshan and preparation guide.",
              )}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="pl-9"
                  placeholder={lc(
                    "Search Biraja Temple, Jajpur, Bali, Indonesia or any village",
                  )}
                />
              </div>
              <Button onClick={locate} disabled={searching}>
                <Navigation className="mr-2 h-4 w-4" />
                {lc(searching ? "Searching…" : "Use my location")}
              </Button>
            </div>
            {locationError && (
              <p className="mt-3 text-sm text-destructive">
                {lc(locationError)}
              </p>
            )}
          </section>

          <section className="mt-8 overflow-hidden rounded-[2rem] border bg-card shadow-xl">
            <div className="grid lg:grid-cols-[.9fr_1.1fr]">
              <div className="relative min-h-[330px] overflow-hidden bg-orange-950">
                <ResilientCoverImage
                  sources={[]}
                  searchQuery={selected.imageQuery || `${selected.name} temple`}
                  alt={lc(selected.name)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-orange-500 text-white">
                      {lc(selected.type)}
                    </Badge>
                    <Badge className="bg-black/40 text-white backdrop-blur">
                      {lc(selected.country)}
                    </Badge>
                  </div>
                  <h2 className="mt-3 text-3xl font-bold">
                    {lc(selected.name)}
                  </h2>
                  <p className="mt-1 text-orange-100">
                    {lc(selected.city)}, {lc(selected.state)}
                  </p>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-sm font-semibold text-orange-700">
                  {lc(selected.deity)}
                </p>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {lc(
                    selected.summary ||
                      "A live place-search result. Confirm ritual, access and visitor information with the temple before travelling.",
                  )}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <GuideFact
                    icon={CalendarDays}
                    label={lc("Darshan planning")}
                    value={lc(selected.timings)}
                  />
                  <GuideFact
                    icon={Sparkles}
                    label={lc("Best season")}
                    value={lc(selected.bestSeason || "Check local weather and festival dates")}
                  />
                  <GuideFact
                    icon={Plane}
                    label={lc("Nearest airport")}
                    value={lc(selected.nearestAirport || "Use the live flight search below")}
                  />
                  <GuideFact
                    icon={Route}
                    label={lc("Rail and road")}
                    value={lc(selected.railOrRoad || "Use the live route search below")}
                  />
                </div>
              </div>
            </div>
            <div className="grid border-t sm:grid-cols-2 lg:grid-cols-3">
              {actions.map((action) => (
                <a
                  key={action.label}
                  href={action.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-24 items-start gap-3 border-b p-5 transition hover:bg-orange-50 dark:hover:bg-orange-950/20 sm:border-r"
                >
                  <action.icon className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                  <span>
                    <strong className="flex items-center gap-1">
                      {lc(action.label)}
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </strong>
                    <small className="mt-1 block leading-5 text-muted-foreground">
                      {lc(action.detail)}
                    </small>
                  </span>
                </a>
              ))}
            </div>
          </section>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
            <section className="overflow-hidden rounded-3xl border bg-card">
              <iframe
                key={selected.id}
                title={tk("mapOfTempleTemplate", { name: lc(selected.name) })}
                src={mapUrl(selected)}
                className="h-[380px] w-full border-0"
                loading="lazy"
              />
            </section>
            <section className="rounded-3xl border bg-card p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <BookOpenCheck className="text-emerald-600" />
                {lc("Before you book")}
              </h2>
              <ol className="mt-5 space-y-4">
                {lcl(preparation).map((item, index) => (
                  <li key={item} className="flex gap-3 text-sm leading-6">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700 dark:bg-orange-950/40">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
              {selected.etiquette && (
                <div className="mt-6 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/20">
                  <p className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-200">
                    <ShieldCheck className="h-4 w-4" />
                    {lc("Temple etiquette")}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-emerald-900/80 dark:text-emerald-100/80">
                    {lcl(selected.etiquette).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>

          <div className="mb-5 mt-12 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {lc(query ? "Matching temple guides" : "Explore sacred places")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {lc(`${list.length} results · curated guides plus live OpenStreetMap discovery`)}
              </p>
            </div>
          </div>
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {list.map((temple, index) => (
              <button
                type="button"
                key={temple.id}
                onClick={() => {
                  setSelected(temple);
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
                className={`animate-fade-in rounded-3xl border bg-card p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl ${selected.id === temple.id ? "border-orange-600 ring-1 ring-orange-600" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <Badge variant={temple.discovered ? "outline" : "secondary"}>
                    {lc(temple.type)}
                  </Badge>
                  {temple.distance != null && (
                    <span className="text-xs text-muted-foreground">
                      {Math.round(temple.distance)} km
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-xl font-bold">{lc(temple.name)}</h3>
                <p className="mt-2 text-sm text-orange-700">
                  {lc(temple.deity)}
                </p>
                <p className="mt-3 flex items-start text-sm text-muted-foreground">
                  <MapPin className="mr-2 mt-0.5 h-4 w-4 shrink-0" />
                  {lc(
                    [temple.city, temple.state, temple.country]
                      .filter(Boolean)
                      .join(", "),
                  )}
                </p>
              </button>
            ))}
          </section>
          {!list.length && !searching && (
            <div className="mt-6 rounded-3xl border border-dashed p-10 text-center">
              <p className="font-semibold">
                {lc("No mapped temple matched this spelling.")}
              </p>
              <a
                href={searchUrl(`${query} Hindu temple`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center text-sm font-semibold text-orange-700"
              >
                {lc("Search the wider web for this temple")}
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          )}
          <p className="mt-8 text-xs text-muted-foreground">
            {tk("mapAttribution")}
          </p>
        </main>
      </Layout>
    </ThemeProvider>
  );
}

function GuideFact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-700">
        <Icon className="h-4 w-4" />
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}
