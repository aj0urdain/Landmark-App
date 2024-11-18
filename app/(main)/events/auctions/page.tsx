'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, Gavel, History } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import Countdown from 'react-countdown';
import { EventCard } from '@/components/molecules/EventCard/EventCard';

interface Auction {
  venue: string;
  end_date: string | null;
  auction_id: number;
  start_date: string;
  auction_location: string;
}

interface PortfolioWithAuctions {
  afr: string;
  auctions: Auction[];
  created_at: string;
  portfolio_id: number;
  magazine_print: string;
  advertising_period_end: string;
  advertising_period_start: string;
}

// TODO: complete this page

const AuctionsPage = () => {
  const { data: activePortfolio, isLoading } = useQuery({
    queryKey: ['activePortfolio'],
    queryFn: async () => {
      const supabase = createBrowserClient();
      const { data, error } = await supabase.rpc('get_active_portfolio_with_auctions');
      if (error) throw error;

      const typedData = data as unknown as PortfolioWithAuctions;
      const auctionEvents = typedData.auctions.map((auction: Auction) => ({
        type: 'auction' as const,
        title: `${auction.auction_location} Auction`,
        start_date: auction.start_date,
        end_date: auction.end_date,
        portfolio_id: typedData.portfolio_id,
        details: auction,
      }));

      return {
        ...typedData,
        auctionEvents,
      };
    },
  });

  const { data: pastAuctions } = useQuery({
    queryKey: ['pastAuctions'],
    queryFn: async () => {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('auctions')
        .select('*, auction_locations(name), auction_venues(name, image)')
        .lt('start_date', new Date().toISOString())
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: futureAuctions } = useQuery({
    queryKey: ['futureAuctions'],
    queryFn: async () => {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('auctions')
        .select('*, auction_locations(name), auction_venues(name, image)')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto space-y-8 p-8">
      {/* Active Portfolio Section */}
      {activePortfolio && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Gavel className="h-6 w-6" />
            <h1 className="text-3xl font-bold">
              Portfolio {activePortfolio.portfolio_id}
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Advertising Period
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(activePortfolio.advertising_period_start), 'PPP')} -{' '}
                  {format(new Date(activePortfolio.advertising_period_end), 'PPP')}
                </p>
              </CardContent>
            </Card>

            {activePortfolio.auctionEvents.slice(0, 2).map((event) => (
              <EventCard key={event.details.auction_id} event={event} variant="full" />
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Auctions Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming Auctions
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Past Auctions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {futureAuctions?.map((auction) => (
              <Link
                key={auction.id}
                href={`/events/auctions/${auction.portfolio_id}/${auction.auction_locations.name}`}
              >
                <Card className="group overflow-hidden transition-all hover:shadow-lg">
                  <div className="relative h-48">
                    <Image
                      src={auction.auction_venues?.image ?? ''}
                      alt={auction.auction_venues?.name ?? ''}
                      fill
                      sizes="250px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
                    <div className="absolute bottom-4 left-4">
                      <Badge>{auction.auction_locations.name}</Badge>
                      <h3 className="mt-2 text-lg font-bold text-white">
                        {auction.auction_venues.name}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(auction.start_date), 'PPP')}
                      </p>
                      <Countdown
                        date={new Date(auction.start_date)}
                        renderer={({ days, hours, minutes }) => (
                          <p className="text-sm font-medium">
                            {days}d {hours}h {minutes}m
                          </p>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastAuctions?.map((auction) => (
              <Card key={auction.id} className="overflow-hidden opacity-75">
                <div className="relative h-48">
                  <Image
                    src={auction.auction_venues?.image ?? ''}
                    alt={auction.auction_venues?.name ?? ''}
                    fill
                    sizes="250px"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/30" />
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary">{auction.auction_locations.name}</Badge>
                    <h3 className="mt-2 text-lg font-bold text-white">
                      {auction.auction_venues.name}
                    </h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(auction.start_date), 'PPP')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuctionsPage;
