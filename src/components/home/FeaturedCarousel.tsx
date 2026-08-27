import { ArrowUpRight, BookHeart, Flame, Sunrise } from 'lucide-react';
import { Link } from 'react-router-dom';

const moments = [
  { eyebrow: 'Morning practice', title: 'Begin with Gayatri', detail: 'A luminous Vedic prayer for clarity and awakening.', href: '/mantras', icon: Sunrise, tone: 'home-moment-sun' },
  { eyebrow: 'Live now', title: 'Enter the temple', detail: 'Discover darshan streams currently broadcasting.', href: '/darshan', icon: Flame, tone: 'home-moment-flame' },
  { eyebrow: 'Read & reflect', title: 'Explore the Gita', detail: 'Open source-backed chapters with a quiet reading view.', href: '/pdf-reader', icon: BookHeart, tone: 'home-moment-night' },
];

const FeaturedCarousel = () => (
  <section className="relative overflow-hidden border-b border-orange-950/5 bg-[#fffaf3] py-20 text-foreground dark:border-white/5 dark:bg-stone-950 dark:text-amber-50 sm:py-24">
    <div className="home-stars absolute inset-0 opacity-20 dark:opacity-50" aria-hidden="true" />
    <div className="container relative mx-auto px-5 lg:px-8">
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700 dark:text-amber-400">A sacred rhythm for every day</p><h2 className="mt-3 max-w-xl font-sanskrit text-3xl font-bold tracking-tight sm:text-4xl">Choose the moment you need.</h2></div>
        <p className="max-w-md text-sm leading-6 text-muted-foreground dark:text-stone-400">No noise, no complicated menus—just a direct path to listening, darshan, and timeless knowledge.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {moments.map((moment, index) => (
          <Link key={moment.title} to={moment.href} className={`home-moment-card group ${moment.tone}`} style={{ animationDelay: `${index * 120}ms` }}>
            <div className="flex items-start justify-between"><div className="rounded-2xl border border-orange-950/10 bg-white/70 p-3 shadow-sm dark:border-white/10 dark:bg-white/10"><moment.icon className="h-6 w-6" /></div><ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" /></div>
            <div className="mt-20"><p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">{moment.eyebrow}</p><h3 className="mt-2 font-sanskrit text-2xl font-bold">{moment.title}</h3><p className="mt-3 text-sm leading-6 opacity-75">{moment.detail}</p></div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedCarousel;
