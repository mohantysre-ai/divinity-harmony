import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from '@/hooks/use-theme';
import AudioPlayer from '@/components/player/AudioPlayer';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import bundledData from '@/data/mantras.json';
import { useToast } from '@/hooks/use-toast';

type Mantra = (typeof bundledData.mantras)[number];

// Fallback-only deity art (used when a mantra has no image, or its own image fails to load).
// Per-mantra images now come from mantra.imageUrl in mantras.json (hash paths verified against
// Wikimedia's MD5-based file path scheme, so each mantra shows its own correct artwork instead
// of one of these 7 shared pictures).
const deityImages: Record<string, string> = {
  Ganesha: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Ganesha_Basohli_miniature_circa_1730_Dubost_p73.jpg',
  Shiva: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Shiva_as_the_Lord_of_Dance_LACMA_edit.jpg',
  'Vishnu & avatars': 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Vishnu_and_Lakshmi_on_Shesha_Naga%2C_ca_1870.jpg',
  'Divine Mother': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Durga_Mahishasuramardini.jpg',
  Hanuman: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Hanuman.jpg',
  'Vedic & planetary': 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Surya_deva.jpg',
  'Vedic & universal': 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Gayatri.jpg',
};

function labelImage(label: string) {
  const safe = encodeURIComponent(label).replace(/'/g, '%27');
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='960' height='540'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%237a1f1f'/%3E%3Cstop offset='1' stop-color='%23401010'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='960' height='540' fill='url(%23g)'/%3E%3Ctext x='480' y='275' text-anchor='middle' font-family='Georgia,serif' font-size='42' fill='%23f8e7c9'%3E${safe}%3C/text%3E%3C/svg%3E`;
}

function isMantra(value: unknown): value is Mantra {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.id === 'number' && typeof entry.title === 'string' && typeof entry.description === 'string'
    && typeof entry.text === 'string' && typeof entry.translation === 'string';
}
function mergeCatalog(remote: Mantra[]) {
  const seen = new Set<string>();
  return [...bundledData.mantras, ...remote].filter((entry) => {
    const key = `${entry.title}|${entry.text}`.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function deityFor(mantra: Mantra) {
  const value = `${mantra.title} ${mantra.description}`.toLowerCase();
  if (/(shiva|rudra|linga|tandava|mrityunjaya)/.test(value)) return 'Shiva';
  if (/(krishna|vishnu|narayana|rama|gita|purusha)/.test(value)) return 'Vishnu & avatars';
  if (/(durga|devi|lakshmi|saraswati|shakti|gayatri|chandi)/.test(value)) return 'Divine Mother';
  if (/(ganesh|ganapati)/.test(value)) return 'Ganesha';
  if (/(hanuman)/.test(value)) return 'Hanuman';
  if (/(surya|aditya|navagraha)/.test(value)) return 'Vedic & planetary';
  return 'Vedic & universal';
}
function imageFor(mantra: Mantra) {
  // Show this mantra's own exact image first. If it's missing, fall back to shared deity art,
  // then to a generated label. (onError below handles a broken/dead link at runtime.)
  return mantra.imageUrl || deityImages[deityFor(mantra)] || labelImage(deityFor(mantra));
}
function applyDeityFallback(event: React.SyntheticEvent<HTMLImageElement>, mantra: Mantra) {
  const image = event.currentTarget;
  const deityArt = deityImages[deityFor(mantra)];
  const stage = image.dataset.deityFallback;
  if (!stage && deityArt && image.src !== deityArt) {
    image.dataset.deityFallback = 'deity';
    image.src = deityArt;
    return;
  }
  image.onerror = null;
  image.dataset.deityFallback = 'label';
  image.src = labelImage(deityFor(mantra));
}

const MantrasPage = () => {
  const { toast } = useToast();
  const [currentMantraIndex, setCurrentMantraIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [deity, setDeity] = useState('All');
  const [remoteMantras, setRemoteMantras] = useState<Mantra[]>([]);
  const [catalogNotice, setCatalogNotice] = useState('');

  useEffect(() => {
    const url = import.meta.env.VITE_MANTRA_CATALOG_URL?.trim();
    if (!url) return;
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('catalog unavailable'); return response.json(); })
      .then((payload) => {
        const entries = Array.isArray(payload) ? payload : payload?.mantras;
        if (!Array.isArray(entries)) throw new Error('invalid catalog format');
        const validEntries = entries.filter(isMantra);
        setRemoteMantras(validEntries);
        setCatalogNotice(validEntries.length ? `Added ${validEntries.length} verified catalog entries.` : '');
      })
      .catch(() => setCatalogNotice('Using the built-in library while the optional catalog is unavailable.'))
    return () => controller.abort();
  }, []);

  const catalog = useMemo(() => mergeCatalog(remoteMantras), [remoteMantras]);
  const currentMantra = catalog[Math.min(currentMantraIndex, catalog.length - 1)];
  const deities = useMemo(() => ['All', ...Array.from(new Set(catalog.map(deityFor))).sort()], [catalog]);
  const visibleMantras = useMemo(() => catalog.map((mantra, index) => ({ mantra, index }))
    .filter(({ mantra }) => {
      const haystack = `${mantra.title} ${mantra.description} ${mantra.text}`.toLowerCase();
      return (deity === 'All' || deityFor(mantra) === deity) && haystack.includes(query.trim().toLowerCase());
    }), [catalog, deity, query]);

  const handleNext = () => currentMantraIndex < catalog.length - 1
    ? setCurrentMantraIndex(currentMantraIndex + 1)
    : toast({ title: 'End of library', description: 'You have reached the final mantra.' });
  const handlePrevious = () => currentMantraIndex > 0
    ? setCurrentMantraIndex(currentMantraIndex - 1)
    : toast({ title: 'Start of library', description: 'You are at the first mantra.' });

  return <ThemeProvider><Layout><main className="container mx-auto py-8">
    <div className="mb-8 text-center"><p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">Sacred Mantras</p>
      <h1 className="mt-2 text-3xl font-bold md:text-4xl">A living devotional library</h1>
      <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Explore {catalog.length}+ prayers, Vedic hymns and stotras. Search by deity, text or intention.</p>
      {catalogNotice && <p className="mt-2 text-sm text-muted-foreground">{catalogNotice}</p>}</div>
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3"><section className="lg:col-span-2"><article className="overflow-hidden rounded-xl bg-card shadow-lg">
      <div className="relative aspect-video bg-muted"><img key={currentMantra.id} src={imageFor(currentMantra)} alt={currentMantra.title} className="h-full w-full object-cover" onError={(event) => applyDeityFallback(event, currentMantra)} />
        <span className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 text-xs font-semibold backdrop-blur">{deityFor(currentMantra)}</span></div>
      <div className="p-6"><h2 className="text-2xl font-bold">{currentMantra.title}</h2><p className="mt-2 text-muted-foreground">{currentMantra.description}</p>
        <blockquote className="mantra-text my-6 rounded-lg bg-muted/50 p-4 text-center text-lg">{currentMantra.text}</blockquote>
        <p className="text-sm text-muted-foreground"><strong>Translation:</strong> {currentMantra.translation}</p></div></article>
      <AudioPlayer text={currentMantra.text} title={currentMantra.title} onNext={handleNext} onPrevious={handlePrevious} hasNext={currentMantraIndex < catalog.length - 1} hasPrevious={currentMantraIndex > 0} /></section>
      <aside className="lg:col-span-1"><h3 className="text-xl font-bold">Mantra Library</h3><p className="mb-3 text-sm text-muted-foreground">{visibleMantras.length} matching prayers</p>
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Shiva, Gayatri, peace…" aria-label="Search mantra library" />
        <div className="my-3 flex flex-wrap gap-2">{deities.map((item) => <Button key={item} size="sm" variant={deity === item ? 'default' : 'outline'} onClick={() => setDeity(item)}>{item}</Button>)}</div>
        <div className="max-h-[570px] space-y-3 overflow-auto pr-2">{visibleMantras.map(({ mantra, index }) => <Card key={mantra.id} role="button" tabIndex={0} className={`cursor-pointer transition-all hover:border-primary/60 ${index === currentMantraIndex ? 'border-primary ring-1 ring-primary' : ''}`} onClick={() => setCurrentMantraIndex(index)} onKeyDown={(event) => event.key === 'Enter' && setCurrentMantraIndex(index)}>
          <CardContent className="flex gap-3 p-3"><img key={mantra.id} src={imageFor(mantra)} alt="" className="h-14 w-14 shrink-0 rounded-md object-cover" onError={(event) => applyDeityFallback(event, mantra)} />
          <div className="min-w-0"><CardTitle className="text-base">{mantra.title}</CardTitle><CardDescription className="mt-1 text-xs">{deityFor(mantra)}</CardDescription></div></CardContent></Card>)}
          {visibleMantras.length === 0 && <p className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">No mantra found. Try another spelling or deity.</p>}</div></aside></div>
  </main></Layout></ThemeProvider>;
};
export default MantrasPage;
