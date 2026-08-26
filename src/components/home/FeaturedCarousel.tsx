import React from 'react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import darshanVideos from '@/data/darshan-videos.json';

const featuredContent = [
  {
    id: 1,
    title: 'Gayatri Mantra',
    description: 'Sacred verse from the Rigveda, personified as Goddess Gayatri',
    type: 'mantra',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Gayatri1.jpg',
    link: '/mantras',
  },
  {
    id: 2,
    title: darshanVideos.videos[0]?.title ?? 'Live Temple Darshan',
    description: darshanVideos.videos[0]?.description ?? 'Live temple streams',
    type: 'darshan',
    image: darshanVideos.videos[0]?.thumbnailUrl ?? '',
    link: '/darshan',
  },
  {
    id: 3,
    title: 'Om Namah Shivaya',
    description: 'One of the most powerful and popular mantras in Hinduism',
    type: 'mantra',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Shiva_as_the_Lord_of_Dance_LACMA_edit.jpg',
    link: '/mantras',
  },
  {
    id: 4,
    title: darshanVideos.videos[1]?.title ?? 'Shirdi Live Darshan',
    description: darshanVideos.videos[1]?.description ?? 'Live temple stream',
    type: 'darshan',
    image: darshanVideos.videos[1]?.thumbnailUrl ?? '',
    link: '/darshan',
  },
];

const FeaturedCarousel = () => {
  const isMobile = useIsMobile();

  return (
    <section className="my-12">
      <h2 className="mb-10 text-center text-3xl font-bold">Featured Content</h2>
      <Carousel className="mx-auto w-full max-w-5xl">
        <CarouselContent>
          {featuredContent.map((item) => (
            <CarouselItem key={item.id} className={isMobile ? 'basis-full' : 'basis-1/2'}>
              <Link to={item.link}>
                <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                  <div className="aspect-video bg-muted">
                    <img src={item.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <CardContent className="p-5">
                    <div className="mb-2 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium">
                      {item.type === 'mantra' ? 'Sacred Mantra' : 'Live Darshan'}
                    </div>
                    <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="-left-6" />
          <CarouselNext className="-right-6" />
        </div>
      </Carousel>
    </section>
  );
};

export default FeaturedCarousel;
