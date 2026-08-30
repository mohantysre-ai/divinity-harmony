import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Music } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from '@/hooks/use-theme';
import { useLocale } from '@/hooks/use-locale';
import { deities } from '@/data/deities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DeitiesPage() {
  const { slug } = useParams();
  const { tk, lc } = useLocale();
  const deity = deities.find((item) => item.slug === slug);

  return (
    <ThemeProvider>
      <Layout>
        <main className="container mx-auto px-4 py-10">
          {deity ? (
            <>
              <Button asChild variant="ghost" className="mb-6">
                <Link to="/deities">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {tk('allDeities')}
                </Link>
              </Button>
              <section className="relative overflow-hidden rounded-3xl shadow-xl">
                <img
                  src={deity.imageUrl}
                  alt={deity.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${deity.color} opacity-80 mix-blend-multiply`} />
                <div className="relative p-8 text-white md:p-12">
                  <p className="text-5xl">{deity.sanskrit}</p>
                  <h1 className="mt-5 text-4xl font-bold">{lc(deity.name)}</h1>
                  <p className="mt-2 text-white/75">{lc(deity.tradition)}</p>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">{lc(deity.summary)}</p>
                </div>
              </section>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <section className="rounded-2xl border p-6">
                  <h2 className="text-xl font-bold">{tk('iconographyAndSymbols')}</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {deity.iconography.map((x) => (
                      <Badge key={x} variant="secondary">
                        {lc(x)}
                      </Badge>
                    ))}
                  </div>
                </section>
                <section className="rounded-2xl border p-6">
                  <h2 className="text-xl font-bold">{tk('sacredFestivalsHeading')}</h2>
                  <ul className="mt-4 space-y-2 text-muted-foreground">
                    {deity.festivals.map((x) => (
                      <li key={x}>• {lc(x)}</li>
                    ))}
                  </ul>
                </section>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to={`/mantras?search=${deity.mantraSearch}`}>
                    <Music className="mr-2 h-4 w-4" />
                    {tk('relatedMantrasBtn')}
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to={`/scriptures?search=${deity.name}`}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    {tk('readSacredLoreBtn')}
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold uppercase tracking-[.2em] text-orange-700">
                {tk('divineForms')}
              </p>
              <h1 className="mt-2 text-4xl font-bold">{tk('deities')}</h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">{tk('deityEncyclopediaDesc')}</p>
              <section className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {deities.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/deities/${item.slug}`}
                    className="group relative min-h-72 overflow-hidden rounded-3xl shadow-lg transition-transform hover:-translate-y-1"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${item.color} via-black/50 to-black/20 opacity-90`} />
                    <div className="relative flex h-full flex-col justify-end p-7 text-white">
                      <p className="text-4xl drop-shadow">{item.sanskrit}</p>
                      <h2 className="mt-3 text-2xl font-bold">{lc(item.name)}</h2>
                      <p className="mt-2 line-clamp-2 text-sm text-white/85">{lc(item.summary)}</p>
                    </div>
                  </Link>
                ))}
              </section>
            </>
          )}
        </main>
      </Layout>
    </ThemeProvider>
  );
}
