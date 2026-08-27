import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Music } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from '@/hooks/use-theme';
import { deities } from '@/data/deities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DeitiesPage() {
 const { slug } = useParams(); const deity = deities.find((item) => item.slug === slug);
 return <ThemeProvider><Layout><main className="container mx-auto px-4 py-10">
  {deity ? <><Button asChild variant="ghost" className="mb-6"><Link to="/deities"><ArrowLeft className="mr-2 h-4 w-4"/>All deities</Link></Button><section className={`overflow-hidden rounded-3xl bg-gradient-to-br ${deity.color} p-8 text-white md:p-12`}><p className="text-5xl">{deity.sanskrit}</p><h1 className="mt-5 text-4xl font-bold">{deity.name}</h1><p className="mt-2 text-white/75">{deity.tradition}</p><p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">{deity.summary}</p></section><div className="mt-8 grid gap-6 md:grid-cols-2"><section className="rounded-2xl border p-6"><h2 className="text-xl font-bold">Iconography and symbols</h2><div className="mt-4 flex flex-wrap gap-2">{deity.iconography.map(x=><Badge key={x} variant="secondary">{x}</Badge>)}</div></section><section className="rounded-2xl border p-6"><h2 className="text-xl font-bold">Sacred festivals</h2><ul className="mt-4 space-y-2 text-muted-foreground">{deity.festivals.map(x=><li key={x}>• {x}</li>)}</ul></section></div><div className="mt-7 flex flex-wrap gap-3"><Button asChild><Link to={`/mantras?search=${deity.mantraSearch}`}><Music className="mr-2 h-4 w-4"/>Related mantras</Link></Button><Button asChild variant="outline"><Link to={`/scriptures?search=${deity.name}`}><BookOpen className="mr-2 h-4 w-4"/>Read sacred lore</Link></Button></div></> : <><p className="text-sm font-semibold uppercase tracking-[.2em] text-orange-700">Divine forms</p><h1 className="mt-2 text-4xl font-bold">Deity Encyclopedia</h1><p className="mt-3 max-w-2xl text-muted-foreground">Explore sacred stories, visual symbols, festivals, mantras and connected scriptures.</p><section className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{deities.map(item=><Link key={item.slug} to={`/deities/${item.slug}`} className={`group min-h-60 rounded-3xl bg-gradient-to-br ${item.color} p-7 text-white shadow-lg transition-transform hover:-translate-y-1`}><p className="text-4xl">{item.sanskrit}</p><h2 className="mt-12 text-2xl font-bold">{item.name}</h2><p className="mt-2 text-sm text-white/80">{item.summary}</p></Link>)}</section></>}
 </main></Layout></ThemeProvider>;
}
