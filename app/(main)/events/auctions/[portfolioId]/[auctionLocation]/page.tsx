'use client';

import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'next/navigation';
import AuctionOverview from '@/components/molecules/AuctionPageContent/AuctionOverview/AuctionOverview';
import AuctionProperties from '@/components/molecules/AuctionPageContent/AuctionProperties/AuctionProperties';
import AuctionVenue from '@/components/molecules/AuctionPageContent/AuctionVenue/AuctionVenue';
import AuctionAttendees from '@/components/molecules/AuctionPageContent/AuctionAttendees/AuctionAttendees';
import AuctionComments from '@/components/molecules/AuctionPageContent/AuctionComments/AuctionComments';
import {
  Building,
  Gavel,
  Info,
  MapPin,
  MessageCircle,
  Users,
  Trophy,
} from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Countdown from 'react-countdown';
import { useAuctionsByPortfolioId } from '@/queries/auctions/hooks';

const renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}) => {
  if (completed) {
    return <span>Auction has started!</span>;
  } else if (days < 0) {
    return <span>Auction has ended!</span>;
  } else {
    return (
      <span>
        {days}d {hours}h {minutes}m {seconds}s
      </span>
    );
  }
};

const AuctionByPortfolioAndLocationPage = () => {
  const { portfolioId, auctionLocation } = useParams();
  const { data: auctions, isLoading } = useAuctionsByPortfolioId(Number(portfolioId));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const auction = auctions?.find(
    (a) =>
      a.auction_locations?.name?.toLowerCase() === String(auctionLocation).toLowerCase(),
  );

  if (!auction) {
    return <div>Auction not found</div>;
  }

  const auctionDate = auction.start_date ? new Date(auction.start_date) : new Date();

  return (
    <div className="h-full w-full">
      <CardContent className="p-6">
        <div className="relative flex min-h-96 flex-col overflow-hidden rounded-3xl">
          <Image
            src={
              auction.auction_venues?.image ||
              `/images/auctionImages/crown-casino-melbourne.jpg`
            }
            alt={`${auction.auction_locations?.name} Auction`}
            width={1000}
            height={1000}
            className="absolute left-0 top-0 h-full w-full object-cover object-center"
          />
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-background via-background/90 to-background/85"></div>

          <div className="relative z-10 flex w-full items-center justify-between p-6">
            <Badge variant="secondary" className="text-lg select-none">
              Portfolio {portfolioId}
            </Badge>
            <div className="flex flex-col items-end gap-1">
              <div className="text-sm text-muted-foreground">
                {auctionDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="text-2xl font-bold tabular-nums">
                <Countdown date={auctionDate} renderer={renderer} />
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-auto flex w-full items-end p-6 pt-0 select-none">
            <div className="flex items-center gap-2">
              <Gavel className="mr-2 h-20 w-20" />
              <div>
                <h1 className="text-7xl font-black">
                  {auction.auction_locations?.name} Auction
                </h1>
                <div className="flex items-center gap-2 text-xl text-muted-foreground font-medium">
                  <MapPin className="h-6 w-6" />
                  {auction.auction_venues?.name || 'Venue TBA'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-6 h-full">
          <TabsList className="bg-transparent mb-4">
            <TabsTrigger value="overview">
              <Info className="mr-2 h-4 w-4" />
              <p className="select-none animated-underline-1">Overview</p>
            </TabsTrigger>
            <TabsTrigger value="venue">
              <MapPin className="mr-2 h-4 w-4" />
              <p className="select-none animated-underline-1">Venue</p>
            </TabsTrigger>
            <TabsTrigger value="attendees" disabled>
              <Users className="mr-2 h-4 w-4" />
              <p className="select-none animated-underline-1">Attendees</p>
            </TabsTrigger>
            <TabsTrigger value="comments" disabled>
              <MessageCircle className="mr-2 h-4 w-4" />
              <p className="select-none animated-underline-1">Comments</p>
            </TabsTrigger>
            <TabsTrigger value="results" disabled>
              <Trophy className="mr-2 h-4 w-4" />
              <p className="select-none animated-underline-1">Results</p>
            </TabsTrigger>
            <TabsTrigger value="listings" disabled>
              <Building className="mr-2 h-4 w-4" />
              <p className="select-none animated-underline-1">Listings</p>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="h-full">
            <AuctionOverview />
          </TabsContent>
          <TabsContent value="venue">
            <AuctionVenue />
          </TabsContent>
          <TabsContent value="attendees">
            <AuctionAttendees />
          </TabsContent>
          <TabsContent value="comments">
            <AuctionComments />
          </TabsContent>
          <TabsContent value="results">
            <div>Results coming soon</div>
          </TabsContent>
          <TabsContent value="listings">
            <AuctionProperties />
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  );
};

export default AuctionByPortfolioAndLocationPage;
