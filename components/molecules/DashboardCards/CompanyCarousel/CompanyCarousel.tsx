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
import PersonalLinks from './PersonalLinks/PersonalLinks';

export default function CompanyCarousel() {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <div className="relative h-full w-5/6">
      <Carousel
        plugins={[plugin.current]}
        className="h-full w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-full">
          <CarouselItem className="flex h-full items-center justify-center">
            <PersonalLinks />
          </CarouselItem>
          <CarouselItem className="flex h-full items-center justify-center">
            <AuctionCountdown />
          </CarouselItem>
          <CarouselItem className="flex h-full items-center justify-center">
            <IndustryNews />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious variant="outline" size="icon" />
        <CarouselNext variant="outline" size="icon" />
      </Carousel>
    </div>
  );
}
