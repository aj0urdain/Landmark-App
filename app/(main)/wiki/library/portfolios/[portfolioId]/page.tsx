'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  Gavel,
  BookOpen,
  Building,
  FileCheck2,
  CloudDownload,
  Loader2,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Database } from '@/types/supabaseTypes';
import { createBrowserClient } from '@/utils/supabase/client';
import PortfolioOverview from '@/components/molecules/PortfolioOverview/PortfolioOverview';
import { PortfolioStatusBadge } from '@/components/atoms/PortfolioStatusBadge/PortfolioStatusBadge';
import { Button } from '@/components/ui/button';
import PortfolioMagazine from '@/components/molecules/PortfolioMagazine/PortfolioMagazine';
import { EventCard } from '@/components/molecules/EventCard/EventCard';
import { useAuctionsByPortfolioId } from '@/queries/auctions/hooks';

export default function PortfolioPage({ params }: { params: { portfolioId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  // Validate tab value and default to 'overview' if invalid
  const validTabs = ['overview', 'auctions', 'magazine', 'listings'];
  const activeTab = validTabs.includes(tab ?? '') ? tab : 'overview';

  const setTab = (newTab: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('tab', newTab);
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/wiki/library/portfolios/${params.portfolioId}${query}`);
  };

  // Add the auctions query
  const { data: auctions, isLoading: auctionsLoading } = useAuctionsByPortfolioId(
    parseInt(params.portfolioId),
  );

  return (
    <div className="container mx-auto h-full w-full p-4">
      <div className="flex h-44 flex-col items-start justify-end">
        <div className="flex flex-col justify-between h-full w-full gap-2">
          <div className="flex w-full justify-end items-center gap-2">
            <PortfolioStatusBadge portfolioId={parseInt(params.portfolioId)} />
          </div>
          <h1 className="mb-2 text-7xl font-bold animate-slide-down-fade-in opacity-0 [animation-delay:_0.5s] [animation-duration:_0.5s] [animation-fill-mode:_forwards]">
            Portfolio {params.portfolioId}
          </h1>
        </div>
      </div>
      <Separator className="my-6" />
      <Tabs
        value={activeTab ?? 'overview'}
        onValueChange={setTab}
        className="w-full animate-slide-down-fade-in opacity-0 [animation-delay:_2s] [animation-duration:_0.5s] [animation-fill-mode:_forwards]"
      >
        <TabsList className="w-fit flex gap-2 bg-transparent mb-4">
          <TabsTrigger
            className="flex h-full w-full items-center gap-1.5 "
            value="overview"
          >
            <Building2 className="h-4 w-4" />
            <span className="animated-underline-1">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="auctions" className="flex items-center space-x-2">
            <Gavel className="h-4 w-4" />
            <span className="animated-underline-1">Auctions</span>
          </TabsTrigger>
          <TabsTrigger value="magazine" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span className="animated-underline-1">Magazine</span>
          </TabsTrigger>
          <TabsTrigger value="listings" className="flex items-center space-x-2" disabled>
            <Building className="h-4 w-4" />
            <span className="animated-underline-1">Listings</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center space-x-2" disabled>
            <FileCheck2 className="h-4 w-4" />
            <span className="animated-underline-1">Results</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="h-full w-full">
          <PortfolioOverview portfolioId={params.portfolioId} />
        </TabsContent>
        <TabsContent value="auctions">
          <Card className="h-full w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Portfolio Auctions</CardTitle>
            </CardHeader>
            <CardContent>
              {auctionsLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : !auctions?.length ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <Gavel className="h-12 w-12 mb-4" />
                  <p className="text-lg">No auctions scheduled yet!</p>
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {auctions.map((auction) => {
                    const event = {
                      type: 'auction' as const,
                      title: `${auction.auction_locations?.name} Auction`,
                      start_date: auction.start_date ?? new Date().toISOString(),
                      end_date: auction.end_date ?? new Date().toISOString(),
                      portfolio_id: parseInt(params.portfolioId),
                      details: {
                        auction_location: auction.auction_locations?.name ?? '',
                        auction_id: auction.id,
                        venue: auction.auction_venues?.name ?? '',
                        first_name: '',
                        last_name: '',
                        ...auction,
                      },
                    };
                    return <EventCard key={auction.id} event={event} variant="full" />;
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="magazine">
          <PortfolioMagazine portfolioId={params.portfolioId} />
        </TabsContent>
        <TabsContent value="listings">
          {/* <PortfolioProperties properties={portfolioData.properties} /> */}
        </TabsContent>
        <TabsContent value="results">
          {/* <PortfolioResults results={portfolioData.results} /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
