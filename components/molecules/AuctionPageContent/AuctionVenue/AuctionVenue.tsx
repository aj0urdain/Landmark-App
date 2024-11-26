'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useAuctionsByPortfolioId } from '@/queries/auctions/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

const AuctionVenue = () => {
  const { portfolioId, auctionLocation } = useParams();
  const { data: auctions } = useAuctionsByPortfolioId(Number(portfolioId));

  const auction = auctions?.find(
    (a) =>
      a.auction_locations?.name?.toLowerCase() === String(auctionLocation).toLowerCase(),
  );

  if (!auction?.auction_venues) {
    return <div>Venue information not available</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {auction.auction_venues.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {auction.auction_venues.image && (
            <div className="relative h-[300px] w-full overflow-hidden rounded-lg">
              <Image
                src={auction.auction_venues.image || ''}
                alt={auction.auction_venues.name || 'Venue Image'}
                fill
                className="object-cover"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionVenue;
