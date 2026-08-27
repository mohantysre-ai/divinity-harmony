import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJapaCounter } from '@/hooks/use-japa-counter';

export default function JapaCounter({ mantraId }: { mantraId: string | number }) {
  const { count, increment, reset } = useJapaCounter(mantraId);
  const round = count ? Math.ceil(count / 108) : 0;
  return <section className="mt-5 rounded-2xl border border-orange-900/10 bg-orange-50/70 p-5 text-center dark:bg-orange-950/20">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">Digital Japa Mala</p>
    <button type="button" onClick={increment} className="mx-auto mt-4 flex h-32 w-32 flex-col items-center justify-center rounded-full border-8 border-orange-200 bg-gradient-to-br from-orange-600 to-red-700 text-white shadow-xl transition-transform active:scale-95 dark:border-orange-900" aria-label="Add one japa">
      <span className="text-4xl font-bold">{count}</span><span className="text-xs">tap to count</span>
    </button>
    <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground"><span>{count % 108}/108 this mala</span><span>{round} rounds</span><Button size="sm" variant="ghost" onClick={reset}><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button></div>
  </section>;
}
