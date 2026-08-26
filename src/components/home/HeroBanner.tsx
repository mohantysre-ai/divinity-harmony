import { ArrowRight, BookOpenText, Play, Radio, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroBanner = () => (
  <section className="home-hero relative isolate overflow-hidden">
    <div className="home-grain absolute inset-0 opacity-40" aria-hidden="true" />
    <div className="home-orb home-orb-one" aria-hidden="true" />
    <div className="home-orb home-orb-two" aria-hidden="true" />
    <div className="container relative mx-auto grid min-h-[680px] items-center gap-12 px-5 py-20 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:py-24">
      <div className="home-rise max-w-3xl">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900 shadow-sm backdrop-blur-xl dark:border-amber-500/20 dark:bg-stone-950/50 dark:text-amber-200">
          <Sparkles className="h-4 w-4 text-orange-600" /> Sacred wisdom · Living tradition
        </div>
        <p className="mb-3 font-sanskrit text-lg font-semibold tracking-[0.22em] text-orange-700 dark:text-amber-300">ॐ सर्वे भवन्तु सुखिनः</p>
        <h1 className="font-sanskrit text-5xl font-bold leading-[1.02] tracking-[-0.045em] text-stone-950 sm:text-6xl lg:text-7xl dark:text-amber-50">
          A quieter space for your <span className="home-gradient-text block">daily sacred journey.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-700 dark:text-stone-300">Listen to timeless mantras, experience live temple darshan, and study Hindu scriptures in one beautifully connected sanctuary.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-14 rounded-full bg-gradient-to-r from-orange-700 to-red-700 px-7 text-white shadow-[0_14px_35px_-12px_rgba(194,65,12,.8)] hover:brightness-110">
            <Link to="/mantras"><Play className="mr-2 h-4 w-4 fill-current" /> Begin with a mantra</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-orange-900/15 bg-white/60 px-7 backdrop-blur-lg hover:bg-white dark:bg-stone-950/40 dark:hover:bg-stone-900">
            <Link to="/darshan"><Radio className="mr-2 h-4 w-4 text-red-600" /> Watch live darshan</Link>
          </Button>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-stone-600 dark:text-stone-400">
          <span className="flex items-center gap-2"><BookOpenText className="h-4 w-4 text-orange-700" /><strong className="text-stone-900 dark:text-stone-100">700+</strong> sacred resources</span>
          <span className="flex items-center gap-2"><Radio className="h-4 w-4 text-red-600" /><strong className="text-stone-900 dark:text-stone-100">Live</strong> temple discovery</span>
        </div>
      </div>
      <div className="home-rise home-delay relative mx-auto flex w-full max-w-[520px] items-center justify-center">
        <div className="home-mandala">
          <div className="home-mandala-ring home-ring-one" />
          <div className="home-mandala-ring home-ring-two" />
          <div className="home-mandala-ring home-ring-three" />
          <div className="home-om">ॐ</div>
        </div>
        <div className="absolute -bottom-5 left-2 rounded-2xl border border-white/60 bg-white/75 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-stone-950/70 sm:left-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-700">Today’s intention</p>
          <p className="mt-1 font-sanskrit text-lg font-semibold">Peace in every breath</p>
        </div>
        <Link to="/pdf-reader" className="pointer-events-auto absolute right-0 top-7 flex items-center gap-2 rounded-full border border-white/60 bg-white/75 px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-xl transition-transform hover:scale-105 dark:border-white/10 dark:bg-stone-950/70">
          Read wisdom <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
    <div className="home-arch-border" aria-hidden="true" />
  </section>
);

export default HeroBanner;
