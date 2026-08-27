
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroBanner from '@/components/home/HeroBanner';
import FeatureTiles from '@/components/home/FeatureTiles';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import { ThemeProvider } from '@/hooks/use-theme';
import PanchangWidget from '@/components/home/PanchangWidget';

const Index = () => {
  return (
    <ThemeProvider>
      <Layout>
        <HeroBanner />
        <PanchangWidget />
        <FeaturedCarousel />
        <FeatureTiles />
      </Layout>
    </ThemeProvider>
  );
};

export default Index;
