
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-hindu-red to-hindu-orange mb-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.32)_0,transparent_24%),radial-gradient(circle_at_75%_75%,rgba(255,210,128,0.25)_0,transparent_28%)]"></div>
      <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-md">
            Begin Your Spiritual Journey
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
            Access sacred mantras, live temple darshans, and spiritual texts to embrace divine harmony in your life.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-white text-hindu-red hover:bg-white/90">
              <Link to="/mantras">Explore Mantras</Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-hindu-red hover:bg-white/90">
              <Link to="/darshan">Watch Live Darshan</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
