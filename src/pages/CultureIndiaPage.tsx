import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, BookOpen, CalendarRange, ChefHat, Clock3, ExternalLink, Landmark, Languages, MapPinned, Mountain, Palette, Search, Sparkles, UsersRound } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ResilientCoverImage from "@/components/ResilientCoverImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ThemeProvider } from "@/hooks/use-theme";
import { useLocale, type AppLocale } from "@/hooks/use-locale";
import { culturePacks, type CulturePack } from "@/data/culture-packs";
import { defaultCultureProfile, stateCultureProfiles, type StateCultureProfile } from "@/data/state-culture-profiles";
import { deepDiveFor, type StateDeepDive } from "@/data/culture-deep-dives";

type LiveCultureContext = { title: string; description: string; summary: string; imageUrl: string; sourceUrl: string; officialUrl: string; sourceName: string };
const profileFor = (id: string) => stateCultureProfiles[id] ?? defaultCultureProfile;
const themed = (profile: StateCultureProfile) => ({ "--state-accent": profile.accent, "--state-accent-2": profile.accent2, "--state-ink": profile.ink }) as CSSProperties;

function useLiveCultureContext(stateId?: string) {
  const [context, setContext] = useState<LiveCultureContext | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!stateId) { setContext(null); return; }
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/culture/context?state=${encodeURIComponent(stateId)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("context unavailable")))
      .then((data: LiveCultureContext) => setContext(data)).catch(() => setContext(null)).finally(() => setLoading(false));
    return () => controller.abort();
  }, [stateId]);
  return { context, loading };
}

export default function CultureIndiaPage() {
  const { id } = useParams();
  const { locale, tk, lc, lcl } = useLocale();
  const [query, setQuery] = useState("");
  const [quickStateId, setQuickStateId] = useState<string>();
  const selected = culturePacks.find((pack) => pack.id === id);
  const quickState = culturePacks.find((pack) => pack.id === quickStateId);
  const selectedLive = useLiveCultureContext(selected?.id);
  const quickLive = useLiveCultureContext(quickStateId);
  const items = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return culturePacks;
    return culturePacks.filter((pack) => {
      const profile = profileFor(pack.id);
      return [pack.name, pack.language, pack.calendar, profile.region, profile.motif, ...pack.festivals, ...pack.traditions, ...pack.temples, ...profile.arts, ...profile.foods].join(" ").toLocaleLowerCase().includes(normalized);
    });
  }, [query]);
  const statistics = useMemo(() => ({ places: culturePacks.length, festivals: new Set(culturePacks.flatMap((pack) => pack.festivals)).size, traditions: new Set(culturePacks.flatMap((pack) => pack.traditions)).size, sacredPlaces: culturePacks.reduce((count, pack) => count + pack.temples.length, 0) }), []);

  if (selected) return <ThemeProvider><Layout><StateCultureGuide selected={selected} profile={profileFor(selected.id)} context={selectedLive.context} loading={selectedLive.loading} locale={locale} lc={lc} lcl={lcl} tk={tk} /></Layout></ThemeProvider>;

  return <ThemeProvider><Layout><main className="container mx-auto px-4 py-8 md:py-12">
    <section className="culture-atlas-hero">
      <div className="relative z-10 max-w-3xl"><p className="text-sm font-bold uppercase tracking-[.22em] text-amber-200">{tk("manyCalendarsTagline")}</p><h1 className="mt-3 text-4xl font-bold text-white md:text-6xl">{tk("cultureOfIndia")}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-white/80 md:text-lg">{tk("cultureIndiaIntro")}</p><div className="relative mt-7 max-w-2xl"><Search className="absolute left-4 top-4 h-5 w-5 text-white/60" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-13 border-white/20 bg-white/10 pl-12 text-base text-white backdrop-blur placeholder:text-white/55" placeholder={tk("searchCulturePlaceholder")} /></div></div>
      <div className="culture-atlas-mandala" aria-hidden>भारत</div>
    </section>
    <section className="culture-stat-ribbon" aria-label={lc("State culture statistics")}><CultureStat value={statistics.places} label={lc("States and union territories")} /><CultureStat value={statistics.festivals} label={lc("Featured festivals")} /><CultureStat value={statistics.traditions} label={lc("Living traditions")} /><CultureStat value={statistics.sacredPlaces} label={lc("Sacred places to explore")} /></section>
    <div className="mt-9 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-orange-700">{lc("A cultural atlas")}</p><h2 className="mt-1 text-3xl font-bold">{lc("Choose a state. Open its story.")}</h2></div><p className="text-sm text-muted-foreground">{tk("culturePacksNoticeTemplate", { count: String(items.length) })}</p></div>
    <section className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map((pack, index) => { const profile = profileFor(pack.id); return <button type="button" key={pack.id} onClick={() => setQuickStateId(pack.id)} style={{ ...themed(profile), animationDelay: `${index * 30}ms` }} className="culture-state-card animate-fade-in text-left"><div className="culture-state-card-top"><span className="culture-state-script">{pack.script}</span><Badge className="border-white/20 bg-black/20 text-white backdrop-blur">{lc(profile.region)}</Badge></div><div className="relative z-10 mt-14"><p className="text-sm font-semibold text-white/70">{lc(profile.motif)}</p><h3 className="mt-1 text-3xl font-bold text-white">{lc(pack.name)}</h3><p className="mt-2 line-clamp-2 min-h-12 text-base leading-6 text-white/80">{lc(profile.pride)}</p></div><div className="relative z-10 mt-6 grid grid-cols-3 gap-2 border-t border-white/15 pt-4"><MiniStat value={pack.festivals.length} label={lc("Festivals")} /><MiniStat value={profile.arts.length} label={lc("Arts")} /><MiniStat value={pack.temples.length} label={lc("Journeys")} /></div><span className="relative z-10 mt-5 inline-flex items-center text-sm font-bold text-white">{lc("Reveal this culture")} <ArrowUpRight className="ml-2 h-4 w-4" /></span></button>; })}</section>
    {!items.length && <div className="mt-10 rounded-3xl border bg-card p-10 text-center"><Search className="mx-auto h-10 w-10 text-muted-foreground" /><h2 className="mt-4 text-xl font-bold">{lc("No culture card matches this search")}</h2><p className="mt-2 text-muted-foreground">{lc("Try a state, language, festival, art form, food or temple name.")}</p></div>}
    <StateQuickView pack={quickState} profile={quickState ? profileFor(quickState.id) : undefined} context={quickLive.context} loading={quickLive.loading} locale={locale} open={Boolean(quickState)} onOpenChange={(open) => !open && setQuickStateId(undefined)} lc={lc} lcl={lcl} />
  </main></Layout></ThemeProvider>;
}

function StateQuickView({ pack, profile, context, loading, locale, open, onOpenChange, lc, lcl }: { pack?: CulturePack; profile?: StateCultureProfile; context: LiveCultureContext | null; loading: boolean; locale: AppLocale; open: boolean; onOpenChange: (open: boolean) => void; lc: (value: string) => string; lcl: (values: string[]) => string[] }) {
  if (!pack || !profile) return null;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent style={themed(profile)} className="max-h-[92vh] max-w-5xl overflow-y-auto border-0 p-0 sm:rounded-[2rem]">
    <div className="culture-quick-hero"><ResilientCoverImage sources={context?.imageUrl ? [context.imageUrl] : []} searchQuery={`${pack.name} culture heritage India`} alt={lc(`${pack.name} cultural landscape`)} /><div className="absolute inset-0 bg-gradient-to-t from-[var(--state-ink)] via-black/45 to-transparent" /><DialogHeader className="relative z-10 mt-auto p-7 text-left text-white md:p-10"><Badge className="mb-3 w-fit border-white/20 bg-white/15 text-white">{lc(profile.region)} · {pack.script}</Badge><DialogTitle className="text-4xl font-bold md:text-5xl">{lc(pack.name)}</DialogTitle><DialogDescription className="max-w-3xl text-base leading-7 text-white/80">{lc(profile.pride)}</DialogDescription></DialogHeader></div>
    <div className="grid gap-8 p-7 md:grid-cols-[1.15fr_.85fr] md:p-10"><div><p className="culture-eyebrow">{lc("Why this place is special")}</p>{loading ? <div className="mt-4 h-24 animate-pulse rounded-2xl bg-muted" /> : <p className="mt-3 text-base leading-8 text-muted-foreground">{locale === "en" && context?.summary ? context.summary : lc(profile.pride)}</p>}<div className="mt-6 grid gap-3 sm:grid-cols-2"><StoryTile icon={Palette} title={lc("Signature arts")} text={lcl(profile.arts).join(" · ")} /><StoryTile icon={ChefHat} title={lc("Taste of the state")} text={lcl(profile.foods).join(" · ")} /><StoryTile icon={Mountain} title={lc("Cultural landscape")} text={lc(profile.landscape)} /><StoryTile icon={Clock3} title={lc("Comfortable travel season")} text={lc(profile.bestSeason)} /></div></div>
      <aside className="rounded-3xl bg-muted/60 p-6"><p className="culture-eyebrow">{lc("State pulse")}</p><div className="mt-4 grid grid-cols-3 gap-2"><MiniStat value={pack.festivals.length} label={lc("Festivals")} dark /><MiniStat value={pack.traditions.length} label={lc("Traditions")} dark /><MiniStat value={pack.temples.length} label={lc("Journeys")} dark /></div><h3 className="mt-7 font-bold">{lc("Begin with these living traditions")}</h3><div className="mt-3 flex flex-wrap gap-2">{lcl([...pack.festivals, ...pack.traditions]).map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}</div><div className="mt-7 grid gap-3"><Button asChild className="bg-[var(--state-accent)] text-white hover:opacity-90"><Link to={`/culture/${pack.id}`}>{lc("Explore the complete state story")} <ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button><a href={context?.officialUrl || `https://www.incredibleindia.gov.in/en/${pack.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold">{lc("Open official tourism source")} <ExternalLink className="ml-2 h-4 w-4" /></a></div></aside>
    </div>
  </DialogContent></Dialog>;
}

function StateCultureGuide({ selected, profile, context, loading, locale, lc, lcl, tk }: { selected: CulturePack; profile: StateCultureProfile; context: LiveCultureContext | null; loading: boolean; locale: AppLocale; lc: (value: string) => string; lcl: (values: string[]) => string[]; tk: (key: string, vars?: Record<string, string>) => string }) {
  const [openModuleId, setOpenModuleId] = useState<keyof StateDeepDive | null>(null);
  const modules = [
    { id: "calendar", icon: CalendarRange, title: "Festival calendar", intro: "Festivals connect the year to harvest, devotion and community memory." },
    { id: "rituals", icon: UsersRound, title: "Ritual and community", intro: "These traditions are starting points—not a single rule for every family or district." },
    { id: "journeys", icon: Landmark, title: "Sacred journeys", intro: "Sacred places reveal how landscape, architecture, story and pilgrimage meet." },
    { id: "language", icon: Languages, title: "Language and oral memory", intro: "Language carries local names, songs, vows, proverbs and ritual vocabulary." },
    { id: "arts", icon: Palette, title: "Arts and material culture", intro: "Art carries knowledge through bodies, cloth, colour, rhythm and craft." },
    { id: "food", icon: ChefHat, title: "Food and hospitality", intro: "Food offers an accessible doorway into season, geography and celebration." },
  ] as const;
  const openModule = modules.find((module) => module.id === openModuleId);
  return <main style={themed(profile)} className="pb-12">
    <section className="culture-detail-hero"><ResilientCoverImage sources={context?.imageUrl ? [context.imageUrl] : []} searchQuery={`${selected.name} culture heritage India`} alt={lc(`${selected.name} cultural landscape`)} /><div className="absolute inset-0 bg-gradient-to-r from-[var(--state-ink)] via-black/70 to-transparent" /><div className="container relative z-10 mx-auto px-4 py-10 text-white md:py-16"><Button asChild variant="ghost" className="mb-10 text-white hover:bg-white/10 hover:text-white"><Link to="/culture"><ArrowLeft className="mr-2 h-4 w-4" />{tk("backToCulturePacks")}</Link></Button><p className="text-sm font-bold uppercase tracking-[.22em] text-white/65">{lc(profile.region)} · {lc(profile.motif)}</p><h1 className="mt-3 text-5xl font-bold md:text-7xl">{lc(selected.name)}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-white/85">{lc(profile.pride)}</p><div className="mt-7 flex flex-wrap gap-2"><Badge className="bg-white text-[var(--state-ink)]">{lc(selected.language)}</Badge><Badge className="border-white/25 bg-white/10 text-white">{lc(selected.calendar)}</Badge><Badge className="border-white/25 bg-white/10 text-white">{selected.script}</Badge></div></div></section>
    <div className="container mx-auto px-4"><section className="culture-detail-stats"><CultureStat value={selected.festivals.length} label={lc("Featured festivals")} /><CultureStat value={selected.traditions.length} label={lc("Living traditions")} /><CultureStat value={profile.arts.length} label={lc("Signature arts")} /><CultureStat value={selected.temples.length} label={lc("Sacred journeys")} /></section>
      <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_.8fr]"><article className="rounded-[2rem] border bg-card p-7 shadow-sm md:p-9"><p className="culture-eyebrow">{lc("A sourced living overview")}</p><h2 className="mt-2 text-3xl font-bold">{lc("The story behind the state")}</h2>{loading ? <div className="mt-5 h-32 animate-pulse rounded-2xl bg-muted" /> : <p className="mt-4 text-base leading-8 text-muted-foreground">{locale === "en" && context?.summary ? context.summary : lc(profile.pride)}</p>}<div className="mt-7 flex flex-wrap gap-3"><a href={context?.officialUrl || `https://www.incredibleindia.gov.in/en/${selected.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-xl bg-[var(--state-accent)] px-5 py-3 text-sm font-bold text-white">{lc("Incredible India state guide")}<ExternalLink className="ml-2 h-4 w-4" /></a>{context?.sourceUrl && <a href={context.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-xl border px-5 py-3 text-sm font-bold">{lc("Read the reference overview")}<BookOpen className="ml-2 h-4 w-4" /></a>}</div></article><aside className="culture-pride-panel"><span className="text-7xl font-bold opacity-15">{selected.script}</span><p className="mt-5 text-sm font-bold uppercase tracking-[.2em] opacity-70">{lc("Pride of place")}</p><p className="mt-3 text-xl font-semibold leading-8">{lc(profile.pride)}</p></aside></section>
      <section className="mt-10"><p className="culture-eyebrow">{lc("Explore by meaning, not just category")}</p><h2 className="mt-2 text-3xl font-bold">{lc("Six ways to understand this culture")}</h2><div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{modules.map((module, index) => <MeaningCard key={module.id} index={index + 1} icon={module.icon} title={lc(module.title)} text={lc(module.intro)} accent={profile.accent} expandLabel={lc(deepDiveFor(selected.id, module.id) ? "See the full story" : "Open cultural details")} onOpen={() => setOpenModuleId(module.id)}>{module.id === "calendar" && <ChipList items={lcl(selected.festivals)} />}{module.id === "rituals" && <ChipList items={lcl(selected.traditions)} />}{module.id === "journeys" && <div className="mt-5 grid gap-2">{selected.temples.map((temple, templeIndex) => <Link key={temple} to={`/temples?search=${encodeURIComponent(temple)}`} onClick={(event) => event.stopPropagation()} className="flex items-center justify-between rounded-xl border p-3 text-sm font-semibold hover:border-[var(--state-accent)]">{lcl(selected.temples)[templeIndex]}<MapPinned className="h-4 w-4" /></Link>)}</div>}{module.id === "arts" && <ChipList items={lcl(profile.arts)} />}{module.id === "food" && <ChipList items={lcl(profile.foods)} />}</MeaningCard>)}</div></section>
      <section className="mt-10 grid gap-6 md:grid-cols-2"><StoryTile icon={Mountain} title={lc("Landscape shapes culture")} text={lc(profile.landscape)} large /><StoryTile icon={Clock3} title={lc("Plan with the season")} text={`${lc(profile.bestSeason)}. ${lc("Festival dates and access conditions still need local confirmation.")}`} large /></section>
      <section className="mt-10 rounded-[2rem] border bg-card p-7 md:p-9"><div className="grid gap-8 lg:grid-cols-[1fr_.9fr]"><div><p className="culture-eyebrow">{lc("Continue exploring")}</p><h2 className="mt-2 text-2xl font-bold">{lc("Move from state overview to living places")}</h2><p className="mt-3 leading-7 text-muted-foreground">{lc("Open a sacred-place guide, check a current official tourism source, or search for a district-level tradition. Local communities are the final authority on living practice.")}</p><div className="mt-5 flex flex-wrap gap-3"><Button asChild className="bg-[var(--state-accent)]"><Link to={`/temples?search=${encodeURIComponent(selected.name)}`}>{lc("Explore sacred places")}</Link></Button><Button asChild variant="outline"><Link to="/scriptures">{lc("Open the reading library")}</Link></Button></div></div><div className="rounded-3xl bg-muted/60 p-6"><h3 className="font-bold">{lc("Read with respect")}</h3><ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground"><li>• {lc("A state contains many communities, districts, languages and lineages.")}</li><li>• {lc("Ask before photographing worship, people or sacred objects.")}</li><li>• {lc("Confirm ritual, calendar, food and dress customs locally.")}</li></ul></div></div></section>
    </div>
    <ModuleDetailDialog selected={selected} profile={profile} module={openModule} lc={lc} lcl={lcl} open={Boolean(openModule)} onOpenChange={(open) => !open && setOpenModuleId(null)} />
  </main>;
}

function moduleHighlights(selected: CulturePack, profile: StateCultureProfile, moduleId: keyof StateDeepDive): string[] {
  if (moduleId === "calendar") return selected.festivals;
  if (moduleId === "rituals") return selected.traditions;
  if (moduleId === "journeys") return selected.temples;
  if (moduleId === "language") return [selected.language, selected.calendar, selected.script];
  if (moduleId === "arts") return profile.arts;
  return profile.foods;
}

function ModuleDetailDialog({ selected, profile, module, lc, lcl, open, onOpenChange }: { selected: CulturePack; profile: StateCultureProfile; module?: { id: keyof StateDeepDive; icon: typeof Landmark; title: string; intro: string }; lc: (value: string) => string; lcl: (values: string[]) => string[]; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!module) return null;
  const deepDive = deepDiveFor(selected.id, module.id);
  const Icon = module.icon;
  const highlights = lcl(moduleHighlights(selected, profile, module.id));
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent style={themed(profile)} className="max-h-[88vh] max-w-3xl overflow-y-auto sm:rounded-[1.75rem]">
    <DialogHeader><div className="mb-2 flex items-center gap-3"><span className="culture-meaning-icon"><Icon className="h-6 w-6" /></span><div><p className="culture-eyebrow">{lc(selected.name)}</p><DialogTitle className="mt-1 text-left text-2xl">{lc(module.title)}</DialogTitle></div></div><DialogDescription className="text-left text-base leading-7 text-foreground/80">{lc(deepDive?.catalogSummary ? module.intro : deepDive?.overview || module.intro)}</DialogDescription></DialogHeader>
    {deepDive ? <div className="mt-3 space-y-4">{deepDive.catalogSummary && <div className="rounded-2xl border-l-4 border-l-[var(--state-accent)] bg-muted/40 p-5"><p className="culture-eyebrow">{lc("Why this place is special")}</p><p className="mt-2 text-sm leading-7 text-muted-foreground">{lc(deepDive.overview)}</p></div>}{deepDive.context && <div className="grid gap-3 sm:grid-cols-2">{deepDive.context.map((fact) => <div key={fact.label} className="rounded-2xl border bg-card p-4"><p className="culture-eyebrow">{lc(fact.label)}</p><p className="mt-2 text-sm font-semibold leading-6">{lc(fact.value)}</p></div>)}</div>}{deepDive.catalogSummary ? <div className="rounded-2xl border bg-card p-5"><h4 className="font-bold">{lc("Cultural highlights")}</h4><div className="mt-4 grid gap-3 sm:grid-cols-2">{highlights.map((item) => <div key={item} className="flex min-h-14 items-center rounded-xl border bg-muted/30 px-4 py-3 text-sm font-semibold leading-6"><Sparkles className="mr-3 h-4 w-4 shrink-0 text-[var(--state-accent)]" />{item}</div>)}</div></div> : deepDive.items.map((item) => <article key={item.name} className="rounded-2xl border bg-muted/40 p-5"><h4 className="text-lg font-bold">{lc(item.name)}</h4>{item.detail && <p className="mt-2 text-sm leading-7 text-muted-foreground">{lc(item.detail)}</p>}{item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--state-accent)] hover:underline">{lc("Read the source")} <ExternalLink className="h-3.5 w-3.5" /></a>}</article>)}{deepDive.sourceUrl && <a href={deepDive.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--state-accent)] hover:underline">{lc(deepDive.sourceLabel || "Read the reference source")} <ExternalLink className="h-4 w-4" /></a>}</div> : <div className="mt-4 rounded-2xl border bg-muted/40 p-5"><h4 className="font-bold">{lc("Cultural highlights")}</h4><div className="mt-3 flex flex-wrap gap-2">{highlights.map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}</div><p className="mt-4 text-sm leading-6 text-muted-foreground">{lc(profile.pride)}</p></div>}
  </DialogContent></Dialog>;
}

function CultureStat({ value, label }: { value: number; label: string }) { return <div><strong>{value}</strong><span>{label}</span></div>; }
function MiniStat({ value, label, dark = false }: { value: number; label: string; dark?: boolean }) { return <div className={dark ? "text-foreground" : "text-white"}><strong className="block text-xl">{value}</strong><span className="text-xs opacity-70">{label}</span></div>; }
function StoryTile({ icon: Icon, title, text, large = false }: { icon: typeof Palette; title: string; text: string; large?: boolean }) { return <article className={`rounded-2xl border bg-card ${large ? "p-7" : "p-4"}`}><Icon className="h-5 w-5 text-[var(--state-accent)]" /><h3 className="mt-3 font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p></article>; }
function ChipList({ items }: { items: string[] }) { return <div className="mt-5 flex flex-wrap gap-2">{items.map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}</div>; }
function MeaningCard({ icon: Icon, index, title, text, children, accent, expandLabel, onOpen }: { icon: typeof Landmark; index: number; title: string; text: string; children?: ReactNode; accent: string; expandLabel: string; onOpen: () => void }) { return <article className="culture-meaning-card cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--module-accent)] focus-visible:ring-offset-2" style={{ "--module-accent": accent } as CSSProperties} role="button" tabIndex={0} onClick={onOpen} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(); } }}><div className="flex items-center justify-between"><span className="culture-meaning-icon"><Icon className="h-6 w-6" /></span><span className="text-xs font-bold tracking-[.2em] text-muted-foreground">{String(index).padStart(2, "0")}</span></div><h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mt-3 text-base leading-7 text-muted-foreground">{text}</p>{children}<span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--module-accent)]">{expandLabel}<ArrowUpRight className="h-3.5 w-3.5" /></span></article>; }
