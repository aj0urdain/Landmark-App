'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, Gavel, History, Building2 } from 'lucide-react';
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
      if (error) {
        console.error(error);
        throw new Error(error.message);
      }

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
        .select('*, auction_locations(name), auction_venues(name, image), portfolios(*)')
        .lt('start_date', new Date().toISOString())
        .order('start_date', { ascending: false });

      if (error) {
        console.error(error);
        throw new Error(error.message);
      }
      return data;
    },
  });

  const { data: futureAuctions } = useQuery({
    queryKey: ['futureAuctions'],
    queryFn: async () => {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('auctions')
        .select('*, auction_locations(name), auction_venues(name, image), portfolios(*)')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true });

      if (error) {
        console.error(error);
        throw new Error(error.message);
      }
      return data;
    },
  });

  const groupAuctionsByPortfolio = (auctions: any[]) => {
    return auctions?.reduce((acc, auction) => {
      const portfolioId = auction.portfolio_id;
      if (!acc[portfolioId]) {
        acc[portfolioId] = [];
      }
      acc[portfolioId].push(auction);
      return acc;
    }, {});
  };

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
            {activePortfolio.auctionEvents.slice(0, 3).map((event) => (
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
          {Object.entries(groupAuctionsByPortfolio(futureAuctions || [])).map(
            ([portfolioId, auctions]) => (
              <Card key={portfolioId} className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    Portfolio {portfolioId}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {auctions.map((auction: any) => (
                      <Link
                        key={auction.id}
                        href={`/events/auctions/${String(auction.portfolio_id)}/${
                          auction.auction_locations?.name ?? ''
                        }`}
                      >
                        <Card className="group overflow-hidden transition-all hover:shadow-md border-muted bg-muted/50">
                          <div className="relative h-24">
                            <Image
                              src={auction.auction_venues?.image ?? ''}
                              alt={auction.auction_venues?.name ?? ''}
                              fill
                              sizes="250px"
                              className="object-cover opacity-50 grayscale transition-all duration-300 group-hover:opacity-75 group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/60" />

                            {/* Top right - Time information */}
                            <div className="absolute top-2 right-2">
                              <div className="relative">
                                <p className="text-xs text-muted-foreground absolute transition-all duration-300 opacity-100 group-hover:opacity-0">
                                  {format(new Date(auction.start_date ?? ''), 'PPP')}
                                </p>
                                <div className="transition-all duration-300 opacity-0 group-hover:opacity-100">
                                  <Countdown
                                    date={new Date(auction.start_date ?? '')}
                                    renderer={({ days, hours, minutes }) => (
                                      <p className="text-xs font-medium text-muted-foreground">
                                        {days}d {hours}h {minutes}m
                                      </p>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Bottom left - Location information */}
                            <div className="absolute bottom-2 left-2">
                              <div className="relative">
                                <p className="text-sm font-medium absolute transition-all duration-300 opacity-100 group-hover:opacity-0">
                                  {auction.auction_locations?.name ?? ''}
                                </p>
                                <p className="text-sm font-medium transition-all duration-300 opacity-0 group-hover:opacity-100">
                                  {auction.auction_venues?.name ?? ''}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ),
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {Object.entries(groupAuctionsByPortfolio(pastAuctions || [])).map(
            ([portfolioId, auctions]) => (
              <Card key={portfolioId} className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    Portfolio {portfolioId}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {auctions.map((auction: any) => (
                      <Card
                        key={auction.id}
                        className="group overflow-hidden transition-all border-muted bg-muted/50 opacity-75"
                      >
                        <div className="relative h-24">
                          <Image
                            src={auction.auction_venues?.image ?? ''}
                            alt={auction.auction_venues?.name ?? ''}
                            fill
                            sizes="250px"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/30" />
                          <div className="absolute inset-0 flex flex-col justify-center items-center">
                            <p className="text-lg font-medium text-center group-hover:opacity-0 transition-opacity duration-300">
                              {auction.auction_locations?.name ?? ''}
                            </p>
                            <p className="text-sm font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {auction.auction_venues?.name ?? ''}
                            </p>
                          </div>
                        </div>
                        <CardContent className="p-2">
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-muted-foreground group-hover:opacity-0 transition-opacity duration-300">
                              {format(new Date(auction.start_date ?? ''), 'PPP')}
                            </p>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Countdown
                                date={new Date(auction.start_date ?? '')}
                                renderer={({ days, hours, minutes }) => (
                                  <p className="text-xs font-medium text-muted-foreground">
                                    {days}d {hours}h {minutes}m
                                  </p>
                                )}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ),
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuctionsPage;
