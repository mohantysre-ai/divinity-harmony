import { useMemo, useState } from "react";
import { BookOpen, Landmark, Search, Sparkles } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/hooks/use-theme";
import { culturePacks } from "@/data/culture-packs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
export default function CultureIndiaPage() {
  const [q, setQ] = useState("");
  const items = useMemo(
    () =>
      culturePacks.filter((x) =>
        `${x.name} ${x.language} ${x.calendar} ${x.festivals} ${x.traditions} ${x.temples}`
          .toLowerCase()
          .includes(q.toLowerCase()),
      ),
    [q],
  );
  return (
    <ThemeProvider>
      <Layout>
        <main>
          <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-8 dark:from-amber-950/30 dark:via-background dark:to-rose-950/20">
            <Sparkles className="absolute right-8 top-8 h-20 w-20 text-orange-200/50" />
            <p className="text-xs font-bold uppercase tracking-[.22em] text-orange-700">
              Many calendars · many living traditions
            </p>
            <h1 className="mt-2 text-4xl font-bold">Culture of India</h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Explore state and union-territory culture packs without forcing
              one regional practice onto every family.
            </p>
            <div className="relative mt-6 max-w-xl">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-9"
                placeholder="Search Karnataka, Jagannath, Durga Puja, Tamil…"
              />
            </div>
          </section>
          <p className="my-6 text-sm text-muted-foreground">
            {items.length} regional culture packs. Editorial details identify
            traditions rather than declaring one universal ritual sequence.
          </p>
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((pack, index) => (
              <article
                key={pack.id}
                style={{ animationDelay: `${index * 35}ms` }}
                className="animate-fade-in rounded-3xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-3xl">{pack.script}</p>
                    <h2 className="mt-2 text-xl font-bold">{pack.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {pack.language} · {pack.calendar}
                    </p>
                  </div>
                  <Landmark className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="mt-5 flex items-center gap-2 text-sm font-bold">
                  <Sparkles className="h-4 w-4" />
                  Observances
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {pack.festivals.map((x) => (
                    <Badge key={x} variant="secondary">
                      {x}
                    </Badge>
                  ))}
                </div>
                <h3 className="mt-5 flex items-center gap-2 text-sm font-bold">
                  <BookOpen className="h-4 w-4" />
                  Living traditions
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {pack.traditions.join(" · ")}
                </p>
                <p className="mt-4 border-t pt-4 text-xs text-muted-foreground">
                  Temples: {pack.temples.join(" · ")}
                </p>
              </article>
            ))}
          </section>
        </main>
      </Layout>
    </ThemeProvider>
  );
}
