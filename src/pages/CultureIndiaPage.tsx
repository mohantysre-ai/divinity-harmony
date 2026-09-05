import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarRange,
  ExternalLink,
  Landmark,
  Languages,
  MapPinned,
  Search,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/hooks/use-theme";
import { useLocale } from "@/hooks/use-locale";
import { culturePacks } from "@/data/culture-packs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CultureIndiaPage() {
  const { id } = useParams();
  const { tk, lc, lcl } = useLocale();
  const [q, setQ] = useState("");
  const [localTopic, setLocalTopic] = useState("");
  const [visibleGuideCount, setVisibleGuideCount] = useState(3);
  const guideSentinel = useRef<HTMLDivElement>(null);
  const selected = culturePacks.find((pack) => pack.id === id);

  const guideModules = useMemo(() => selected ? [
    { id: "calendar", icon: CalendarRange, title: lc("Festival calendar and seasonal rhythm") },
    { id: "rituals", icon: UsersRound, title: lc("Home worship and community ritual") },
    { id: "journeys", icon: Landmark, title: lc("Temples and sacred journeys") },
    { id: "language", icon: Languages, title: lc("Language, script and oral memory") },
    { id: "arts", icon: Sparkles, title: lc("Arts, food and living heritage") },
    { id: "travel", icon: MapPinned, title: lc("Respectful local travel") },
  ] : [], [selected, lc]);

  useEffect(() => {
    setVisibleGuideCount(3);
  }, [selected?.id]);

  useEffect(() => {
    const node = guideSentinel.current;
    if (!node || visibleGuideCount >= guideModules.length) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleGuideCount((count) => Math.min(count + 2, guideModules.length));
    }, { rootMargin: "240px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [guideModules.length, visibleGuideCount]);

  const scrollToGuide = (sectionId: string) => {
    const index = guideModules.findIndex((item) => item.id === sectionId);
    if (index >= visibleGuideCount) setVisibleGuideCount(index + 1);
    window.setTimeout(() => document.getElementById(`culture-${sectionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  const items = useMemo(
    () =>
      culturePacks.filter((x) =>
        [
          x.name,
          x.language,
          x.calendar,
          ...x.festivals,
          ...x.traditions,
          ...x.temples,
          lc(x.name),
          lc(x.language),
          lc(x.calendar),
          ...lcl(x.festivals),
          ...lcl(x.traditions),
          ...lcl(x.temples),
        ]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase()),
      ),
    [q, lc, lcl],
  );

  if (selected) {
    return (
      <ThemeProvider>
        <Layout>
          <main className="container mx-auto px-4 py-10">
            <Button asChild variant="ghost" className="mb-6">
              <Link to="/culture">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {tk("backToCulturePacks")}
              </Link>
            </Button>
            <section className="relative overflow-hidden rounded-[2rem] border bg-gradient-to-br from-orange-50 via-card to-rose-50 p-8 shadow-sm dark:from-orange-950/20 dark:to-background">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[40px] border-orange-200/20" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-orange-500 to-rose-700 text-center text-xl font-bold text-white shadow-xl ring-1 ring-orange-900/10" aria-label={lc("Cultural identity symbol")}>
                {selected.script}
              </div>
              <h1 className="relative mt-3 text-4xl font-bold md:text-5xl">
                {lc(selected.name)}
              </h1>
              <p className="relative mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
                {lc("A living regional culture shaped by")} {lc(selected.calendar)}, {lcl(selected.traditions).join(", ")} {lc("and sacred journeys to")} {lcl(selected.temples).join(", ")}.
              </p>
              <div className="relative mt-6 flex flex-wrap gap-2">
                <Badge className="bg-orange-600 text-white">{lc(selected.language)}</Badge>
                <Badge variant="outline">{lc(selected.calendar)}</Badge>
              </div>
            </section>

            <nav className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4" aria-label={lc("Explore this state guide")}>
              <CultureDetailCard icon={CalendarRange} title={lc("Seasonal rhythm")} openLabel={lc("Open section")} onClick={() => scrollToGuide("calendar")}>
                <p className="text-sm leading-6 text-muted-foreground">
                  {lc("Festivals follow")} {lc(selected.calendar)}. {lc("Always confirm the date and local observance window in a regional Panchanga.")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lcl(selected.festivals).map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}
                </div>
              </CultureDetailCard>
              <CultureDetailCard icon={UsersRound} title={lc("Home and community traditions")} openLabel={lc("Open section")} onClick={() => scrollToGuide("rituals")}>
                <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                  {lcl(selected.traditions).map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </CultureDetailCard>
              <CultureDetailCard icon={Landmark} title={lc("Sacred journeys")} openLabel={lc("Open section")} onClick={() => scrollToGuide("journeys")}>
                <div className="space-y-2">
                  {selected.temples.map((temple, index) => (
                    <Link key={temple} to={`/temples?search=${encodeURIComponent(temple)}`} className="flex items-center justify-between rounded-xl border p-3 text-sm font-semibold transition hover:border-orange-400">
                      {lcl(selected.temples)[index]}
                      <MapPinned className="h-4 w-4 text-orange-600" />
                    </Link>
                  ))}
                </div>
              </CultureDetailCard>
              <CultureDetailCard icon={Languages} title={lc("Language and learning")} openLabel={lc("Open section")} onClick={() => scrollToGuide("language")}>
                <p className="text-sm leading-6 text-muted-foreground">
                  {lc("Use the language switch in the header to read the portal in")} {lc(selected.language)}. {lc("Pronunciation, offerings and ritual names should follow local speakers and family custom.")}
                </p>
                <Link to="/scriptures" className="mt-4 inline-flex text-sm font-semibold text-orange-700">
                  {lc("Open the sacred reading library")} →
                </Link>
              </CultureDetailCard>
            </nav>

            <section className="mt-8 space-y-5" aria-label={lc("Detailed state culture guide")}>
              {guideModules.slice(0, visibleGuideCount).map((module, index) => (
                <article id={`culture-${module.id}`} key={module.id} className="scroll-mt-28 animate-fade-in overflow-hidden rounded-[2rem] border bg-card shadow-sm">
                  <div className="grid md:grid-cols-[190px_1fr]">
                    <div className="relative flex min-h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100 dark:from-orange-950/40 dark:to-rose-950/30">
                      <span className="absolute text-8xl font-bold text-orange-900/5">{selected.script}</span>
                      <module.icon className="relative h-14 w-14 text-orange-700" />
                    </div>
                    <div className="p-6 md:p-8">
                      <p className="text-xs font-bold uppercase tracking-[.2em] text-orange-700">{lc(selected.name)} · {String(index + 1).padStart(2, "0")}</p>
                      <h2 className="mt-2 text-2xl font-bold">{module.title}</h2>
                      <StateGuideBody section={module.id} selected={selected} lc={lc} lcl={lcl} />
                      {module.id === "journeys" && <div className="mt-4 flex flex-wrap gap-2">{selected.temples.map((temple, templeIndex) => <Link key={temple} to={`/temples?search=${encodeURIComponent(temple)}`} className="rounded-full border px-4 py-2 text-sm font-semibold hover:border-orange-500">{lcl(selected.temples)[templeIndex]}</Link>)}</div>}
                    </div>
                  </div>
                </article>
              ))}
              <div ref={guideSentinel} className="flex min-h-14 items-center justify-center">
                {visibleGuideCount < guideModules.length && <Button variant="ghost" onClick={() => setVisibleGuideCount((count) => Math.min(count + 2, guideModules.length))}>{lc("Load more state culture")}</Button>}
              </div>
            </section>

            <section className="mt-6 rounded-[2rem] border bg-card p-6 md:p-8">
              <div className="grid gap-8 lg:grid-cols-[1fr_.9fr]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-orange-700">
                    {lc("District and community explorer")}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    {lc("Go beyond the state-level summary")}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {lc("Enter a district, village, community, art form, food tradition, temple festival or family ritual. The search stays specific to")} {lc(selected.name)}.
                  </p>
                  <div className="relative mt-5">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={localTopic}
                      onChange={(event) => setLocalTopic(event.target.value)}
                      className="pl-9"
                      placeholder={lc("Example: Jajpur Chandan Yatra or coastal wedding customs")}
                    />
                  </div>
                  {localTopic.trim() && (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <a href={`https://www.google.com/search?q=${encodeURIComponent(`${localTopic} ${selected.name} culture tradition official tourism`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white">
                        {lc("Research this tradition")}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                      <Link to={`/priests?search=${encodeURIComponent(`${localTopic} ${selected.name}`)}`} className="inline-flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold">
                        {lc("Find local ritual guidance")}
                      </Link>
                    </div>
                  )}
                </div>
                <div className="rounded-3xl bg-amber-50 p-6 dark:bg-amber-950/20">
                  <h3 className="font-bold">{lc("Respectful culture guide")}</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                    <li>• {lc("Ask before photographing worship, people, sacred objects or private ceremonies.")}</li>
                    <li>• {lc("Do not present one caste, district, sampradaya or family custom as the only form of the state.")}</li>
                    <li>• {lc("Confirm fasting, dress, food, mantra and calendar rules with local practitioners.")}</li>
                    <li>• {lc("Support community artisans, temple trusts and verified local guides directly.")}</li>
                  </ul>
                </div>
              </div>
            </section>
          </main>
        </Layout>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Layout>
        <main>
          <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-8 dark:from-amber-950/30 dark:via-background dark:to-rose-950/20">
            <Sparkles className="absolute right-8 top-8 h-20 w-20 text-orange-200/50" />
            <p className="text-xs font-bold uppercase tracking-[.22em] text-orange-700">
              {tk("manyCalendarsTagline")}
            </p>
            <h1 className="mt-2 text-4xl font-bold">{tk("cultureOfIndia")}</h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">{tk("cultureIndiaIntro")}</p>
            <div className="relative mt-6 max-w-xl">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-9"
                placeholder={tk("searchCulturePlaceholder")}
              />
            </div>
          </section>
          <p className="my-6 text-sm text-muted-foreground">
            {tk("culturePacksNoticeTemplate", { count: String(items.length) })}
          </p>
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((pack, index) => (
              <Link
                key={pack.id}
                to={`/culture/${pack.id}`}
                style={{ animationDelay: `${index * 35}ms` }}
                className="animate-fade-in block rounded-3xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-rose-700 px-2 text-center text-sm font-bold text-white shadow-md ring-4 ring-orange-100 dark:ring-orange-950/30" aria-label={lc("Cultural identity symbol")}>{pack.script}</div>
                    <h2 className="mt-2 text-xl font-bold">{lc(pack.name)}</h2>
                    <p className="text-sm text-muted-foreground">
                      {lc(pack.language)} · {lc(pack.calendar)}
                    </p>
                  </div>
                  <Landmark className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="mt-5 flex items-center gap-2 text-sm font-bold">
                  <Sparkles className="h-4 w-4" />
                  {tk("observances")}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {lcl(pack.festivals.slice(0, 3)).map((x, i) => (
                    <Badge key={`${pack.id}-fest-${i}`} variant="secondary">
                      {x}
                    </Badge>
                  ))}
                </div>
                <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {lcl(pack.traditions).join(" · ")}
                </p>
                <p className="mt-5 text-sm font-medium text-orange-700">{tk("viewCultureDetails")} →</p>
              </Link>
            ))}
          </section>
        </main>
      </Layout>
    </ThemeProvider>
  );
}

function StateGuideBody({ section, selected, lc, lcl }: { section: string; selected: (typeof culturePacks)[number]; lc: (value: string) => string; lcl: (values: string[]) => string[] }) {
  const common = lc("Dates and customs can differ by district, community, family tradition and lineage.");
  if (section === "calendar") return <p className="mt-3 leading-7 text-muted-foreground">{lcl(selected.festivals).join(", ")} {lc("are important observances connected with")} {lc(selected.calendar)}. {common}</p>;
  if (section === "rituals") return <p className="mt-3 leading-7 text-muted-foreground">{lcl(selected.traditions).join(", ")} {lc("are major living traditions in")} {lc(selected.name)}. {lc("Consult local elders, temple priests and community organizations for lineage-specific procedure.")}</p>;
  if (section === "journeys") return <p className="mt-3 leading-7 text-muted-foreground">{lcl(selected.temples).join(", ")} {lc("form a starting route for understanding local sacred geography, festivals, temple food, art, music and pilgrimage etiquette.")}</p>;
  if (section === "language") return <p className="mt-3 leading-7 text-muted-foreground">{lc(selected.language)} · {selected.script}. {lc("Regional languages carry local names, songs, vows, stories and ritual vocabulary. Learn pronunciation and meaning with local speakers.")}</p>;
  if (section === "arts") return <p className="mt-3 leading-7 text-muted-foreground">{lc("Explore regional crafts, performance traditions, sacred foods, textiles and festival decorations.")} {common}</p>;
  return <p className="mt-3 leading-7 text-muted-foreground">{lc("Plan temple timings, transport, dress, accessibility and accommodation before travel.")} {lc("Ask before photographing worship or private ceremonies, and support local artisans and guides.")}</p>;
}

function CultureDetailCard({
  icon: Icon,
  title,
  children,
  onClick,
  openLabel,
}: {
  icon: typeof Landmark;
  title: string;
  children: ReactNode;
  onClick: () => void;
  openLabel: string;
}) {
  return (
    <article className="animate-fade-in rounded-3xl border bg-card p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg">
      <button type="button" onClick={onClick} className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
        <Icon className="h-6 w-6 text-orange-600" />
        <h2 className="mt-4 font-bold">{title}</h2>
        <span className="mt-2 inline-flex text-sm font-semibold text-orange-700">{openLabel} →</span>
      </button>
      <div className="mt-3">{children}</div>
    </article>
  );
}
