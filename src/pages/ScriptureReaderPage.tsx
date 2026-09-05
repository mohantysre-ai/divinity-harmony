import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeProvider } from "@/hooks/use-theme";
import { useLocale } from "@/hooks/use-locale";
import { sacredTexts } from "@/data/sacred-texts";
import { buildSacredTextArticle } from "@/lib/sacred-text-content";
import { fetchSacredChapter, fetchSacredSourceContent, type SacredSourceContent } from "@/lib/sacred-source-content";

const PAGE_WORDS = 360;

function paginate(content: string) {
  const paragraphs = content.split(/\n{2,}/).filter(Boolean);
  const pages: string[] = [];
  let page = "";
  for (const paragraph of paragraphs) {
    const nextWords = `${page} ${paragraph}`.trim().split(/\s+/).length;
    if (page && nextWords > PAGE_WORDS) {
      pages.push(page);
      page = paragraph;
    } else page += `${page ? "\n\n" : ""}${paragraph}`;
  }
  if (page) pages.push(page);
  return pages.length ? pages : [""];
}

export default function ScriptureReaderPage() {
  const { id } = useParams();
  const { locale, tk, lc } = useLocale();
  const text = sacredTexts.find((item) => String(item.id) === id);
  const article = text ? buildSacredTextArticle(text) : null;
  const [language, setLanguage] = useState<"en" | "sa">(locale === "en" ? "en" : "sa");
  const [source, setSource] = useState<SacredSourceContent | null>(null);
  const [loading, setLoading] = useState(Boolean(text));
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [turn, setTurn] = useState<"next" | "previous" | null>(null);
  const pages = useMemo(() => paginate(source?.content || ""), [source?.content]);

  useEffect(() => {
    if (!text) return;
    let active = true;
    setLoading(true); setError(""); setSource(null); setPage(0);
    fetchSacredSourceContent(text, language)
      .then((value) => active && setSource(value))
      .catch((reason: Error) => active && setError(reason.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [text, language]);

  const move = (direction: "next" | "previous") => {
    const next = Math.max(0, Math.min(pages.length - 1, page + (direction === "next" ? 1 : -1)));
    if (next === page) return;
    setTurn(direction);
    window.setTimeout(() => { setPage(next); setTurn(null); window.scrollTo({ top: 0, behavior: "smooth" }); }, 230);
  };

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") move("next");
      if (event.key === "ArrowLeft") move("previous");
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });

  const chooseChapter = async (chapter: string) => {
    if (!source || chapter === source.activeChapter) return;
    setLoading(true); setError("");
    try {
      const result = await fetchSacredChapter(source.host, chapter);
      setSource({ ...source, ...result, chapters: source.chapters });
      setPage(0);
    } catch (reason) { setError(reason instanceof Error ? reason.message : tk("chapterUnavailable")); }
    finally { setLoading(false); }
  };

  return <ThemeProvider><Layout><main className="min-h-screen bg-gradient-to-b from-amber-50/70 via-background to-orange-50/40 px-4 py-8 dark:from-stone-950 dark:to-background">
    <div className="mx-auto max-w-6xl">
      <Button asChild variant="ghost"><Link to="/scriptures"><ArrowLeft className="mr-2 h-4 w-4" />{lc("Back to Scripture Library")}</Link></Button>
      {!text || !article ? <section className="mt-8 rounded-3xl border bg-card p-10 text-center"><h1 className="text-2xl font-bold">{lc("Scripture not found")}</h1></section> : <>
        <header className="my-6 rounded-[2rem] border bg-card p-6 shadow-sm md:p-8">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-orange-700">{lc(text.category)}</p>
          <h1 className="mt-2 text-3xl font-bold md:text-5xl">{lc(text.title)}</h1>
          <p className="mt-3 leading-7 text-muted-foreground">{lc(article.introduction)}</p>
          <div className="mt-5 flex flex-wrap gap-2"><Button size="sm" variant={language === "en" ? "default" : "outline"} onClick={() => setLanguage("en")}>{tk("english")}</Button><Button size="sm" variant={language === "sa" ? "default" : "outline"} onClick={() => setLanguage("sa")}>संस्कृत</Button></div>
        </header>
        <section className="rounded-[2rem] border bg-card p-4 shadow-xl md:p-8">
          {source?.chapters.length ? <label className="mb-5 block text-sm font-semibold">{tk("chooseChapterSection")}<select className="mt-2 h-11 w-full rounded-md border bg-background px-3 font-normal" value={source.activeChapter || ""} onChange={(event) => chooseChapter(event.target.value)} disabled={loading}>{source.chapters.map((chapter) => <option key={chapter} value={chapter}>{chapter.replace(`${source.title}/`, "")}</option>)}</select></label> : null}
          {loading && !source ? <div className="flex min-h-96 items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" />{tk("loadingSourceText")}</div> : null}
          {error ? <p className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-destructive">{error}</p> : null}
          {source ? <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground"><span>{source.source} · {source.language} · {source.license}</span><a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center hover:text-orange-700">{tk("sourceAndLicense")}<ExternalLink className="ml-1 h-3.5 w-3.5" /></a></div>
            <div className="scripture-book"><div className="scripture-book-spine" aria-hidden /><div key={`${source.activeChapter}-${page}`} className={`scripture-book-page ${turn ? `is-turning-${turn}` : ""}`}><div className="scripture-book-ornament" aria-hidden>ॐ</div><div data-no-regionalize className="whitespace-pre-wrap text-base leading-8 text-stone-800 dark:text-stone-200">{pages[page]}</div><span className="scripture-page-number">{page + 1}</span></div></div>
            <div className="mt-5 flex items-center justify-between gap-2"><Button variant="outline" disabled={page === 0 || loading} onClick={() => move("previous")}><ChevronLeft className="mr-1 h-4 w-4" />{lc("Previous page")}</Button><Badge variant="secondary">{lc("Page")} {page + 1} / {pages.length}</Badge><Button variant="outline" disabled={page >= pages.length - 1 || loading} onClick={() => move("next")}>{lc("Next page")}<ChevronRight className="ml-1 h-4 w-4" /></Button></div>
          </> : null}
        </section>
      </>}
    </div>
  </main></Layout></ThemeProvider>;
}
