'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import { useAuctionsByPortfolioId } from '@/queries/auctions/hooks';
import { Building, MapPin, MessageCircle, Trophy, User } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const AuctionOverview = () => {
  const { portfolioId, auctionLocation } = useParams();
  const { data: auctions } = useAuctionsByPortfolioId(Number(portfolioId));

  const auction = auctions?.find(
    (a) =>
      a.auction_locations?.name?.toLowerCase() === String(auctionLocation).toLowerCase(),
  );

  // Placeholder data for the bento box layout
  const placeholderAvatars = Array(8).fill(null);

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Venue Card - Spans 2 rows */}
      <Card className="col-span-8 row-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-5 w-5" />
            Venue Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {auction?.auction_venues ? (
            <div className="space-y-4">
              <div className="relative h-[200px] w-full overflow-hidden rounded-lg">
                <Image
                  src={
                    auction.auction_venues.image ||
                    '/images/auctionImages/crown-casino-melbourne.jpg'
                  }
                  alt={auction.auction_venues.name || 'Venue'}
                  fill
                  className="object-cover object-center"
                />
              </div>
              <h3 className="text-xl font-semibold">{auction.auction_venues.name}</h3>
              <p className="text-muted-foreground">
                Join us at this prestigious venue for our upcoming auction event.
              </p>
            </div>
          ) : (
            <p>Venue details will be announced soon</p>
          )}
        </CardContent>
      </Card>

      {/* Attendees Card */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <User className="h-5 w-5" />
            Attendees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {placeholderAvatars.map((_, i) => (
              <Avatar key={i}>
                <AvatarFallback className="bg-muted">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="mt-4 text-muted">Attendee list coming soon</p>
          <div className="mt-4 flex gap-2">
            <Button className="w-full" disabled>
              Attending
            </Button>
            <Button className="w-full" variant="outline" disabled>
              Not Attending
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Trophy className="h-5 w-5" />
            Results
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[100px]">
          <p className="text-muted">Results will be available after the auction</p>
        </CardContent>
      </Card>

      {/* Comments Card */}
      <Card className="col-span-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="h-5 w-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[150px]">
          <p className="text-muted">Comments section coming soon</p>
        </CardContent>
      </Card>

      {/* Listings Card */}
      <Card className="col-span-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Building className="h-5 w-5" />
            Listings
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[150px]">
          <p className="text-muted">Property listings coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionOverview;
