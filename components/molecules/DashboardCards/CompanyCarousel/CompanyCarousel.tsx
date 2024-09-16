'use client';

import React, { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import AuctionCountdown from '@/components/molecules/DashboardCards/CompanyCarousel/AuctionCountdown/AuctionCountdown';
import IndustryNews from '@/components/molecules/DashboardCards/CompanyCarousel/IndustryNews/IndustryNews';

export default function CompanyCarousel() {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <div className='w-5/6 h-full relative'>
      <Carousel
        plugins={[plugin.current]}
        className='w-full h-full'
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className='h-full'>
          <CarouselItem className='h-full flex items-center justify-center'>
            <AuctionCountdown />
          </CarouselItem>
          <CarouselItem className='h-full flex items-center justify-center'>
            <AuctionCountdown />
          </CarouselItem>
          <CarouselItem className='h-full flex items-center justify-center'>
            <IndustryNews />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious variant='outline' size='icon' />
        <CarouselNext variant='outline' size='icon' />
      </Carousel>
    </div>
  );
}
