import React, { useRef } from 'react';
import Hero from '@/components/home/Hero/Hero';
import ProductCarousel from '@/components/home/ProductCarousel/ProductCarousel';
import Collections from '@/components/home/Collections/Collections';
import Approach from '@/components/home/Approach/Approach';
import AestheticGrid from '@/components/home/AestheticGrid/AestheticGrid';

export default function HomePage() {
  const carouselRef = useRef(null);

  return (
    <>
      <Hero />
      <ProductCarousel carouselRef={carouselRef} />
      <Collections />
      <Approach />
      <AestheticGrid />
    </>
  );
}
