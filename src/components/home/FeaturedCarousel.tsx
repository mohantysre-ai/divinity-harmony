import { ArrowUpRight, BookHeart, Flame, Sunrise } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/hooks/use-locale';

const FeaturedCarousel = () => {
  const { tk } = useLocale();

  const moments = [
    {
      eyebrow: tk('morningPractice'),
      title: tk('beginWithGayatri'),
      detail: tk('gayatriDetail'),
      href: '/mantras',
      icon: Sunrise,
      tone: 'home-moment-sun',
    },
    {
      eyebrow: tk('liveNow'),
      title: tk('enterTheTemple'),
      detail: tk('discoverDarshanStreams'),
      href: '/darshan',
      icon: Flame,
      tone: 'home-moment-flame',
    },
    {
      eyebrow: tk('readReflect'),
      title: tk('exploreTheGita'),
      detail: tk('gitaReadingDetail'),
      href: '/pdf-reader',
      icon: BookHeart,
      tone: 'home-moment-night',
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-orange-950/5 bg-[#fffaf3] py-20 text-foreground dark:border-white/5 dark:bg-stone-950 dark:text-amber-50 sm:py-24">
      <div className="home-stars absolute inset-0 opacity-20 dark:opacity-50" aria-hidden="true" />
      <div className="container relative mx-auto px-5 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700 dark:text-amber-400">{tk('sacredRhythmEveryDay')}</p>
            <h2 className="mt-3 max-w-xl font-sanskrit text-3xl font-bold tracking-tight sm:text-4xl">{tk('chooseTheMoment')}</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground dark:text-stone-400">{tk('noNoiseMenus')}</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {moments.map((moment, index) => (
            <Link key={moment.title} to={moment.href} className={`home-moment-card group ${moment.tone}`} style={{ animationDelay: `${index * 120}ms` }}>
              <div className="flex items-start justify-between">
                <div className="rounded-2xl border border-orange-950/10 bg-white/70 p-3 shadow-sm dark:border-white/10 dark:bg-white/10">
                  <moment.icon className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
              <div className="mt-20">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">{moment.eyebrow}</p>
                <h3 className="mt-2 font-sanskrit text-2xl font-bold">{moment.title}</h3>
                <p className="mt-3 text-sm leading-6 opacity-75">{moment.detail}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCarousel;
