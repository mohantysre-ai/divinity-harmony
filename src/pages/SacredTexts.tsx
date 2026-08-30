import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from '@/hooks/use-theme';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, CircleCheck, ExternalLink, Library, Loader2, Search, Sparkles } from 'lucide-react';
import { sacredTextCategories, sacredTexts, type SacredText } from '@/data/sacred-texts';
import { buildSacredTextArticle } from '@/lib/sacred-text-content';
import { fetchSacredChapter, fetchSacredSourceContent, type SacredSourceContent } from '@/lib/sacred-source-content';
import { useSearchParams } from 'react-router-dom';
import { useLocale } from '@/hooks/use-locale';
import { sacredCategoryKey } from '@/lib/sacred-category-i18n';

const categoryStyle: Record<string, { symbol: string; gradient: string }> = {
  'Vedas & Vedangas': { symbol: 'ॐ', gradient: 'from-amber-700 via-orange-600 to-yellow-500' },
  Upanishads: { symbol: 'तत्', gradient: 'from-indigo-800 via-violet-700 to-purple-500' },
  Puranas: { symbol: 'पुराण', gradient: 'from-rose-800 via-red-700 to-orange-500' },
  Gitas: { symbol: 'गीता', gradient: 'from-blue-800 via-sky-700 to-cyan-500' },
  'Itihasa & Sacred Narratives': { symbol: 'धर्म', gradient: 'from-emerald-800 via-green-700 to-lime-500' },
  'Philosophy & Yoga': { symbol: 'योग', gradient: 'from-slate-800 via-indigo-700 to-blue-500' },
  'Deities & Sacred Lore': { symbol: 'देव', gradient: 'from-fuchsia-800 via-pink-700 to-rose-500' },
  'Ancestors & Dharma': { symbol: 'पितृ', gradient: 'from-stone-800 via-amber-800 to-orange-600' },
  'Hymns & Mantras': { symbol: 'मन्त्र', gradient: 'from-teal-800 via-cyan-700 to-sky-500' },
};

const PAGE_SIZE = 60;

const SacredTexts = () => {
  const { tk } = useLocale();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<SacredText | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [sourceContent, setSourceContent] = useState<SacredSourceContent | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState<'en' | 'sa'>('en');
  const [sourceLoading, setSourceLoading] = useState(false);
  const [sourceError, setSourceError] = useState('');
  const [searchParams] = useSearchParams();

  const filteredTexts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return sacredTexts.filter((text) => {
      const matchesCategory = category === 'All' || text.category === category;
      const haystack = [text.title, text.category, text.tradition, text.description, ...text.topics]
        .join(' ')
        .toLowerCase();
      return matchesCategory && (!normalized || haystack.includes(normalized));
    });
  }, [category, query]);

  useEffect(() => setVisibleCount(PAGE_SIZE), [category, query]);
  useEffect(() => { const initial = searchParams.get('search'); if (initial) setQuery(initial); }, [searchParams]);

  useEffect(() => {
    if (!selected) return;
    let active = true;
    setSourceLoading(true);
    setSourceError('');
    setSourceContent(null);
    fetchSacredSourceContent(selected, sourceLanguage)
      .then((content) => active && setSourceContent(content))
      .catch((error: Error) => active && setSourceError(error.message))
      .finally(() => active && setSourceLoading(false));
    return () => { active = false; };
  }, [selected, sourceLanguage]);

  const openText = (text: SacredText) => {
    setSourceLanguage('en');
    setSelected(text);
  };

  const selectChapter = async (page: string) => {
    if (!sourceContent || !page || page === sourceContent.activeChapter) return;
    setSourceLoading(true);
    setSourceError('');
    try {
      const chapter = await fetchSacredChapter(sourceContent.host, page);
      setSourceContent({ ...sourceContent, ...chapter, chapters: sourceContent.chapters });
    } catch (error) {
      setSourceError(error instanceof Error ? error.message : tk('chapterUnavailable'));
    } finally {
      setSourceLoading(false);
    }
  };

  const visibleTexts = filteredTexts.slice(0, visibleCount);
  const selectedArticle = selected ? buildSacredTextArticle(selected) : null;

  return (
    <ThemeProvider>
      <Layout>
        <main className="container mx-auto px-4 py-10">
          <section className="relative mb-10 overflow-hidden rounded-3xl border bg-gradient-to-br from-hindu-red/10 via-background to-hindu-gold/15 px-6 py-10 text-center md:px-12">
            <Sparkles className="mx-auto mb-3 h-7 w-7 text-hindu-gold" />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-hindu-red">{tk('sanatanaKnowledgeLibrary')}</p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">{tk('sacredTextsHeritage')}</h1>
            <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
              {tk('sacredTextsLibraryDesc')}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="px-4 py-2 text-sm"><Library className="mr-2 h-4 w-4" />{tk('resourcesCountTemplate', { count: String(sacredTexts.length) })}</Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm"><BookOpen className="mr-2 h-4 w-4" />{tk('knowledgePathsTemplate', { count: '9' })}</Badge>
            </div>
          </section>

          <section className="mb-8 space-y-5">
            <div className="relative mx-auto max-w-2xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tk('searchScripturesPlaceholder')}
                className="h-12 rounded-full pl-12"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {sacredTextCategories.map((item) => (
                <Button
                  key={item}
                  type="button"
                  size="sm"
                  variant={category === item ? 'default' : 'outline'}
                  className="rounded-full"
                  onClick={() => setCategory(item)}
                >
                  {tk(sacredCategoryKey(item))}
                </Button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {tk('showingResourcesTemplate', { shown: String(filteredTexts.length), total: String(sacredTexts.length) })}
            </p>
          </section>

          {filteredTexts.length ? (
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleTexts.map((text) => {
                const style = categoryStyle[text.category] || categoryStyle['Itihasa & Sacred Narratives'];
                return (
                  <Card key={text.id} className="group flex h-full flex-col overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${style.gradient}`}>
                      <span className="select-none text-4xl font-bold text-white/95 drop-shadow-md">{style.symbol}</span>
                      <Badge className="absolute left-4 top-4 border-white/30 bg-black/25 text-white hover:bg-black/25">#{text.id}</Badge>
                    </div>
                    <CardContent className="flex-1 p-6">
                      <Badge variant="outline" className="mb-3">{tk(sacredCategoryKey(text.category))}</Badge>
                      <h2 className="text-xl font-bold leading-tight">{text.title}</h2>
                      <p className="mt-2 text-xs font-medium text-hindu-red">{text.tradition}</p>
                      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{text.description}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {text.topics.slice(0, 3).map((topic) => <Badge key={topic} variant="secondary" className="font-normal">{topic}</Badge>)}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t p-4">
                      <Button className="w-full" onClick={() => openText(text)}>
                        <BookOpen className="mr-2 h-4 w-4" /> {tk('readFullDetails')}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </section>
          ) : (
            <section className="rounded-2xl border border-dashed p-12 text-center">
              <Search className="mx-auto h-8 w-8 text-muted-foreground" />
              <h2 className="mt-3 text-lg font-semibold">{tk('noMatchingSacredResource')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{tk('tryAllCategories')}</p>
            </section>
          )}

          {visibleCount < filteredTexts.length && (
            <div className="mt-8 flex justify-center">
              <Button variant="outline" size="lg" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                {tk('loadMoreResourcesTemplate', { count: String(Math.min(PAGE_SIZE, filteredTexts.length - visibleCount)) })}
              </Button>
            </div>
          )}

          <section className="mt-10 rounded-2xl border bg-muted/30 p-5 text-sm text-muted-foreground">
            <strong className="text-foreground">{tk('respectfulUseTitle')}:</strong> {tk('respectfulUseLibraryNote')}
          </section>
        </main>

        <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0">
            {selected && selectedArticle && (
              <>
                <div className={`bg-gradient-to-br p-7 text-white ${categoryStyle[selected.category]?.gradient || categoryStyle['Itihasa & Sacred Narratives'].gradient}`}>
                  <DialogHeader>
                    <Badge className="mb-3 w-fit border-white/30 bg-black/20 text-white hover:bg-black/20">{tk(sacredCategoryKey(selected.category))}</Badge>
                    <DialogTitle className="text-left text-3xl text-white">{selected.title}</DialogTitle>
                  </DialogHeader>
                  <p className="mt-2 text-sm font-medium text-white/85">{selected.tradition}</p>
                </div>

                <article className="space-y-8 p-7 md:p-9">
                  <section className="rounded-2xl border bg-card p-5 md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hindu-red">
                          {sourceContent?.sourceType === 'wikisource' ? tk('sourceTextLabel') : tk('detailedSourceArticle')}
                        </p>
                        <h3 className="mt-2 text-2xl font-bold">{sourceContent?.title || selected.title}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant={sourceLanguage === 'en' ? 'default' : 'outline'} onClick={() => setSourceLanguage('en')}>{tk('english')}</Button>
                        <Button size="sm" variant={sourceLanguage === 'sa' ? 'default' : 'outline'} onClick={() => setSourceLanguage('sa')}>संस्कृत</Button>
                      </div>
                    </div>

                    {sourceLoading && !sourceContent && (
                      <div className="flex min-h-48 items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" /> {tk('loadingSourceText')}
                      </div>
                    )}

                    {sourceError && !sourceContent && (
                      <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                        {sourceError} {tk('sourceErrorHint')}
                      </div>
                    )}

                    {sourceContent && (
                      <>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span>{sourceContent.source} · {sourceContent.language}</span>
                          <a className="inline-flex items-center text-muted-foreground hover:text-hindu-red hover:underline" href={sourceContent.url} target="_blank" rel="noreferrer">
                            {tk('sourceAndLicense')} <ExternalLink className="ml-1 h-3.5 w-3.5" />
                          </a>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{sourceContent.license}</p>
                        {sourceContent.chapters.length > 0 && (
                          <label className="mt-5 block text-sm font-semibold">
                            {tk('chooseChapterSection')}
                            <select
                              className="mt-2 h-11 w-full rounded-md border bg-background px-3 font-normal"
                              value={sourceContent.activeChapter || ''}
                              onChange={(event) => selectChapter(event.target.value)}
                              disabled={sourceLoading}
                            >
                              {sourceContent.chapters.map((chapter) => <option key={chapter} value={chapter}>{chapter.replace(`${sourceContent.title}/`, '')}</option>)}
                            </select>
                          </label>
                        )}
                        <div className="relative mt-6 border-t pt-6">
                          {sourceLoading && <Loader2 className="absolute right-0 top-3 h-5 w-5 animate-spin text-hindu-red" />}
                          <div className="whitespace-pre-wrap text-base leading-8 text-foreground/90">{sourceContent.content}</div>
                        </div>
                      </>
                    )}
                  </section>

                  <section>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hindu-red">{tk('studyCompanion')}</p>
                    <h3 className="mt-2 text-2xl font-bold">{tk('backgroundAndMeaning')}</h3>
                    <p className="mt-3 text-base leading-8 text-muted-foreground">{selectedArticle.introduction}</p>
                  </section>

                  <section className="rounded-2xl border bg-muted/25 p-5">
                    <h3 className="text-xl font-bold">{tk('whatResourceTeaches')}</h3>
                    <ul className="mt-4 space-y-3">
                      {selectedArticle.keyPoints.map((point) => (
                        <li key={point} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                          <CircleCheck className="mt-0.5 h-5 w-5 flex-none text-hindu-red" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold">{tk('whyItMatters')}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">{selectedArticle.significance}</p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold">{tk('howToStudyIt')}</h3>
                    <ol className="mt-4 space-y-3">
                      {selectedArticle.studyPath.map((step, index) => (
                        <li key={step} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                          <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{index + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section className="rounded-2xl bg-hindu-gold/10 p-5">
                    <h3 className="font-bold">{tk('traditionAndInterpretation')}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedArticle.context}</p>
                  </section>

                  <section>
                    <h3 className="mb-3 font-semibold">{tk('keyThemes')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {selected.topics.map((topic) => <Badge key={topic} variant="secondary">{topic}</Badge>)}
                    </div>
                  </section>

                  {selectedArticle.practiceNote && (
                    <div className="rounded-xl border border-hindu-red/20 bg-hindu-red/5 p-4 text-sm leading-6 text-muted-foreground">
                      <strong className="text-foreground">{tk('practiceNoteLabel')}</strong> {selectedArticle.practiceNote}
                    </div>
                  )}

                </article>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Layout>
    </ThemeProvider>
  );
};

export default SacredTexts;
