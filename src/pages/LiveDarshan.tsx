import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from '@/hooks/use-theme';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Youtube } from 'lucide-react';
import darshanVideos from '@/data/darshan-videos.json';

function youtubeIdFromUrl(url: string) {
  const match = url.match(/[?&]v=([^&]+)/) || url.match(/embed\/([^?&]+)/);
  return match?.[1] ?? '';
}

function thumbnailFor(video: (typeof darshanVideos.videos)[number]) {
  const id = youtubeIdFromUrl(video.youtubeUrl) || youtubeIdFromUrl(video.embedUrl);
  return video.thumbnailUrl || (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '');
}

const LiveDarshan = () => {
  const { toast } = useToast();
  const [selectedVideo, setSelectedVideo] = useState(darshanVideos.videos[0]);

  const handleSelectVideo = (video: (typeof darshanVideos.videos)[0]) => {
    setSelectedVideo(video);
    toast({
      title: 'Video Selected',
      description: `Now showing: ${video.title}`,
    });
  };

  return (
    <ThemeProvider>
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Live Temple Darshan</h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6 overflow-hidden rounded-xl bg-card shadow-lg">
                <div className="relative aspect-video">
                  <iframe
                    key={selectedVideo.id}
                    src={`${selectedVideo.embedUrl}?rel=0`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="absolute left-0 top-0 h-full w-full border-0"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="mb-2 text-2xl font-bold">{selectedVideo.title}</h2>
                      <p className="text-muted-foreground">{selectedVideo.description}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {selectedVideo.location} · {selectedVideo.deity}
                      </p>
                    </div>
                    <Button asChild variant="outline" className="shrink-0">
                      <a
                        href={selectedVideo.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Youtube className="h-4 w-4 text-red-600" />
                        Watch on YouTube
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <h3 className="mb-4 text-xl font-bold">Available Darshans</h3>
              <div className="max-h-[600px] space-y-4 overflow-auto pr-2">
                {darshanVideos.videos.map((video) => (
                  <Card
                    key={video.id}
                    className={`cursor-pointer transition-all ${video.id === selectedVideo.id ? 'border-primary ring-1 ring-primary' : ''}`}
                    onClick={() => handleSelectVideo(video)}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="h-14 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                        <img
                          src={thumbnailFor(video)}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                          onError={(event) => {
                            const id = youtubeIdFromUrl(video.youtubeUrl);
                            if (id) event.currentTarget.src = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-1 text-sm font-medium">{video.title}</h4>
                        <p className="line-clamp-2 text-xs text-muted-foreground">{video.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ThemeProvider>
  );
};

export default LiveDarshan;
