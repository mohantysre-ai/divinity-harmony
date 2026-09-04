import { useMemo, useState, type ReactNode } from "react";
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
  const selected = culturePacks.find((pack) => pack.id === id);

  const items = useMemo(
    () =>
      culturePacks.filter((x) =>
        `${x.name} ${x.language} ${x.calendar} ${x.festivals} ${x.traditions} ${x.temples}`
          .toLowerCase()
          .includes(q.toLowerCase()),
      ),
    [q],
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
              <p className="relative text-5xl">{selected.script}</p>
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

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <CultureDetailCard icon={CalendarRange} title={lc("Seasonal rhythm")}>
                <p className="text-sm leading-6 text-muted-foreground">
                  {lc("Festivals follow")} {lc(selected.calendar)}. {lc("Always confirm the date and local observance window in a regional Panchanga.")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lcl(selected.festivals).map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}
                </div>
              </CultureDetailCard>
              <CultureDetailCard icon={UsersRound} title={lc("Home and community traditions")}>
                <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                  {lcl(selected.traditions).map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </CultureDetailCard>
              <CultureDetailCard icon={Landmark} title={lc("Sacred journeys")}>
                <div className="space-y-2">
                  {selected.temples.map((temple, index) => (
                    <Link key={temple} to={`/temples?search=${encodeURIComponent(temple)}`} className="flex items-center justify-between rounded-xl border p-3 text-sm font-semibold transition hover:border-orange-400">
                      {lcl(selected.temples)[index]}
                      <MapPinned className="h-4 w-4 text-orange-600" />
                    </Link>
                  ))}
                </div>
              </CultureDetailCard>
              <CultureDetailCard icon={Languages} title={lc("Language and learning")}>
                <p className="text-sm leading-6 text-muted-foreground">
                  {lc("Use the language switch in the header to read the portal in")} {lc(selected.language)}. {lc("Pronunciation, offerings and ritual names should follow local speakers and family custom.")}
                </p>
                <Link to="/scriptures" className="mt-4 inline-flex text-sm font-semibold text-orange-700">
                  {lc("Open the sacred reading library")} →
                </Link>
              </CultureDetailCard>
            </div>

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
                    <p className="text-3xl">{pack.script}</p>
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

function CultureDetailCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Landmark;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="animate-fade-in rounded-3xl border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg">
      <Icon className="h-6 w-6 text-orange-600" />
      <h2 className="mt-4 font-bold">{title}</h2>
      <div className="mt-3">{children}</div>
    </article>
  );
}
