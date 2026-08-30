import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Landmark, Search, Sparkles } from "lucide-react";
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
            <section className="rounded-[2rem] border bg-card p-8 shadow-sm">
              <p className="text-4xl">{selected.script}</p>
              <h1 className="mt-3 text-4xl font-bold">{lc(selected.name)}</h1>
              <p className="mt-2 text-muted-foreground">
                {lc(selected.language)} · {lc(selected.calendar)}
              </p>
              <h2 className="mt-8 flex items-center gap-2 text-lg font-bold">
                <Sparkles className="h-5 w-5 text-orange-600" />
                {tk("observances")}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {lcl(selected.festivals).map((x, i) => (
                  <Badge key={`${selected.id}-fest-${i}`} variant="secondary">
                    {x}
                  </Badge>
                ))}
              </div>
              <h2 className="mt-8 flex items-center gap-2 text-lg font-bold">
                <BookOpen className="h-5 w-5 text-orange-600" />
                {tk("livingTraditions")}
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                {lcl(selected.traditions).join(" · ")}
              </p>
              <h2 className="mt-8 flex items-center gap-2 text-lg font-bold">
                <Landmark className="h-5 w-5 text-orange-600" />
                {tk("templesLabelPrefix")}
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                {lcl(selected.temples).join(" · ")}
              </p>
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
                <p className="mt-5 text-sm font-medium text-orange-700">{tk("viewCultureDetails")} →</p>
              </Link>
            ))}
          </section>
        </main>
      </Layout>
    </ThemeProvider>
  );
}
