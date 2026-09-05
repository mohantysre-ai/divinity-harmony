import { useMemo, useState } from "react";
import { BookMarked, ExternalLink, FileText, Headphones, Landmark, LockKeyhole, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/hooks/use-locale";
import {
  vedicHeritageCatalog,
  vedicHeritageCategories,
  vedicHeritageLinksEnabled,
} from "@/data/vedic-heritage-catalog";

const PAGE_SIZE = 18;

const formatLabel = {
  portal: "PORTAL",
  flipbook: "FLIPBOOK",
  "text-audio": "TEXT + AUDIO",
  pdf: "PDF",
} as const;

export default function VedicHeritageCatalog() {
  const { tk, lc } = useLocale();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof vedicHeritageCategories)[number]>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const entries = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return vedicHeritageCatalog.filter((entry) => {
      if (category !== "All" && entry.category !== category) return false;
      if (!normalized) return true;
      return `${entry.title} ${entry.category}`.toLocaleLowerCase().includes(normalized);
    });
  }, [category, query]);

  const changeCategory = (next: (typeof vedicHeritageCategories)[number]) => {
    setCategory(next);
    setVisible(PAGE_SIZE);
  };

  const categoryLabel = (value: (typeof vedicHeritageCategories)[number]) =>
    value === "All" ? tk("all") : value === "Gitas" ? tk("categoryGitas") : lc(value);

  return (
    <section className="mb-12 overflow-hidden rounded-[2rem] border border-amber-200/70 bg-gradient-to-br from-amber-50 via-background to-orange-50 shadow-sm dark:border-amber-900/40 dark:from-stone-950 dark:to-stone-900">
      <div className="grid gap-6 border-b border-amber-200/60 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8 dark:border-amber-900/40">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-hindu-red">
            <Landmark className="h-5 w-5" />
            <span>{tk("officialSources")}</span>
          </div>
          <h2 className="text-2xl font-bold md:text-3xl">{lc("Vedic Heritage Portal")}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary">{vedicHeritageCatalog.length}</Badge>
            {[...new Set(vedicHeritageCatalog.map((entry) => entry.source))].map((source) => (
              <Badge key={source} variant="secondary" data-no-regionalize>{source}</Badge>
            ))}
            <Badge variant="secondary"><BookMarked className="h-3.5 w-3.5" aria-hidden /></Badge>
          </div>
        </div>
        {!vedicHeritageLinksEnabled ? (
          <div className="flex max-w-sm items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-100/60 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
            <LockKeyhole className="mt-0.5 h-5 w-5 flex-none" />
            <span>{tk("officialSources")}</span>
          </div>
        ) : null}
      </div>

      <div className="space-y-5 p-6 md:p-8">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => { setQuery(event.target.value); setVisible(PAGE_SIZE); }}
            placeholder={tk("searchScripturesPlaceholder")}
            className="h-11 rounded-full bg-background pl-11"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {vedicHeritageCategories.map((item) => (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={category === item ? "default" : "outline"}
              className="rounded-full"
              onClick={() => changeCategory(item)}
            >
              {categoryLabel(item)}
            </Button>
          ))}
        </div>

        {entries.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {entries.slice(0, visible).map((entry, index) => {
              const content = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline" className="bg-background/80">{entry.category === "Gitas" ? tk("categoryGitas") : lc(entry.category)}</Badge>
                      <Badge variant="secondary" className="max-w-52 truncate" data-no-regionalize>{entry.source}</Badge>
                    </div>
                    {entry.format === "flipbook" ? <BookMarked className="h-5 w-5 shrink-0 text-hindu-red" /> : entry.format === "pdf" ? <FileText className="h-5 w-5 shrink-0 text-hindu-red" /> : entry.format === "text-audio" ? <Headphones className="h-5 w-5 shrink-0 text-hindu-red" /> : <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />}
                  </div>
                  <h3 className="mt-4 text-base font-bold leading-snug">{lc(entry.title)}</h3>
                  <p className="mt-3 text-[11px] font-bold tracking-[.14em] text-muted-foreground" data-no-regionalize>{formatLabel[entry.format]}</p>
                </>
              );
              const className = "group min-h-32 rounded-2xl border bg-card p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-hindu-gold/60 hover:shadow-lg animate-fade-in";
              const style = { animationDelay: `${Math.min(index, 18) * 35}ms` };
              return vedicHeritageLinksEnabled ? (
                <a key={entry.id} href={entry.url} target="_blank" rel="noopener noreferrer" className={className} style={style}>
                  {content}
                </a>
              ) : (
                <article key={entry.id} className={className} style={style} aria-disabled="true">
                  {content}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">{tk("noMatchingResource")}</div>
        )}

        {visible < entries.length ? (
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
              {tk("loadMoreResourcesTemplate", { count: String(Math.min(PAGE_SIZE, entries.length - visible)) })}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
