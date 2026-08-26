import { ArrowRight, BookOpen, Languages, Radio, Search, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const paths = [
  { number: '01', title: 'Sacred Mantras', text: 'Search by deity, read the Sanskrit, and listen with an uninterrupted player.', href: '/mantras', icon: Volume2 },
  { number: '02', title: 'Live Darshan', text: 'Watch active temple broadcasts discovered dynamically from across YouTube.', href: '/darshan', icon: Radio },
  { number: '03', title: 'Sacred Texts', text: 'Study Vedas, Gitas, Puranas, philosophy, ancestry, and Hindu heritage.', href: '/pdf-reader', icon: BookOpen },
];

const FeatureTiles = () => (
  <>
    <section className="bg-[#fffaf1] py-20 dark:bg-background sm:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">Your spiritual library</p><h2 className="mt-3 font-sanskrit text-3xl font-bold tracking-tight sm:text-5xl">Ancient wisdom, thoughtfully presented.</h2><p className="mt-5 leading-7 text-muted-foreground">Built for everyday practice—from a two-minute mantra to a deep scripture study.</p></div>
        <div className="grid overflow-hidden rounded-[2rem] border border-orange-950/10 bg-white shadow-[0_24px_80px_-45px_rgba(120,53,15,.45)] dark:bg-card lg:grid-cols-3">
          {paths.map((path) => (
            <Link key={path.title} to={path.href} className="home-path group relative min-h-[340px] border-b border-orange-950/10 p-8 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
              <div className="flex items-center justify-between"><span className="text-xs font-bold tracking-[0.2em] text-orange-700">{path.number}</span><path.icon className="h-6 w-6 text-orange-700 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" /></div>
              <div className="mt-28"><h3 className="font-sanskrit text-2xl font-bold">{path.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{path.text}</p><span className="mt-6 inline-flex items-center text-sm font-semibold text-orange-800">Explore <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></span></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
    <section className="bg-[#f5ead8] py-20 dark:bg-stone-900/60 sm:py-24">
      <div className="container mx-auto grid items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <div className="relative mx-auto aspect-square w-full max-w-md rounded-full border border-orange-900/15 p-8"><div className="home-lotus-grid flex h-full items-center justify-center rounded-full border border-orange-900/10 bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-950/40 dark:to-stone-950"><div className="text-center"><span className="block font-sanskrit text-7xl text-orange-800 dark:text-amber-400">ॐ</span><span className="mt-3 block text-xs font-semibold uppercase tracking-[0.3em] text-orange-900/60 dark:text-amber-200/60">Listen · Read · Reflect</span></div></div></div>
        <div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">Designed around you</p><h2 className="mt-3 font-sanskrit text-3xl font-bold tracking-tight sm:text-5xl">Find what speaks to your heart.</h2><p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">Move naturally between sound, sacred image, meaning, and source text. Every path is searchable and designed to remain calm on mobile as well as desktop.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-orange-900/10 bg-white/65 p-5 backdrop-blur dark:bg-card/70"><Search className="h-5 w-5 text-orange-700" /><h3 className="mt-3 font-semibold">Fast discovery</h3><p className="mt-1 text-sm text-muted-foreground">Search hundreds of resources.</p></div><div className="rounded-2xl border border-orange-900/10 bg-white/65 p-5 backdrop-blur dark:bg-card/70"><Languages className="h-5 w-5 text-orange-700" /><h3 className="mt-3 font-semibold">Sanskrit & English</h3><p className="mt-1 text-sm text-muted-foreground">Original text and clear context.</p></div></div></div>
      </div>
    </section>
  </>
);

export default FeatureTiles;
