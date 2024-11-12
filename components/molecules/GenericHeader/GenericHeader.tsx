import { Waypoints } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface GenericHeaderProps {
  title: string;
  description: string;
}

export function GenericHeader({ title, description }: GenericHeaderProps) {
  return (
    <div className="relative flex min-h-48 items-end justify-start overflow-hidden rounded-3xl">
      <Image
        src={`/images/auctionImages/crown-casino-melbourne.jpg`}
        alt={` Auction`}
        width={1000}
        height={1000}
        className="absolute left-0 top-0 h-full w-full object-cover object-bottom opacity-40"
      />
      <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-background via-background/90 to-background/50"></div>

      <div className="z-10 flex items-center p-6">
        <div>
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="flex items-center gap-2">
              <Waypoints className="mr-2 h-10 w-10" />

              <h1 className="text-4xl font-black">{title}</h1>
            </div>
            <div>
              <p className="text-lg text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
