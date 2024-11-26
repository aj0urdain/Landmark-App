'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { format } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Building2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PortfolioStatusBadge } from '@/components/atoms/PortfolioStatusBadge/PortfolioStatusBadge';
import {
  getAllPortfolios,
  getActivePortfolioWithAuctions,
} from '@/queries/portfolios/api';
import { Database } from '@/types/supabaseTypes';
import { useState } from 'react';

type Portfolio = Database['public']['Tables']['portfolios']['Row'];
type ActivePortfolio = {
  portfolio_id: number;
  signed_schedule: string | null;
  auctions: Array<{
    auction_id: number;
    start_date: string;
    end_date: string;
    auction_location: string;
    venue: string;
  }>;
};

export default function PortfoliosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') ?? 'all';
  const [sortAscending, setSortAscending] = useState(false);

  // Validate tab value and default to 'all' if invalid
  const validTabs = ['all', 'past', 'upcoming'] as const;
  const activeTab = validTabs.includes(tab as any) ? tab : 'all';

  const setTab = (newTab: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('tab', newTab);
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/wiki/library/portfolios${query}`);
  };

  const { data: activePortfolio, isLoading: isLoadingActive } = useQuery({
    queryKey: ['active-portfolio'],
    queryFn: async () => {
      const data = await getActivePortfolioWithAuctions();
      return data as ActivePortfolio;
    },
  });

  const { data: portfolios, isLoading } = useQuery({
    queryKey: ['portfolios', sortAscending, activeTab],
    queryFn: async () => {
      const allPortfolios = await getAllPortfolios();
      return allPortfolios
        .filter((p) => p.id !== activePortfolio?.portfolio_id)
        .sort((a, b) => {
          // Default sorting for 'all' tab
          if (activeTab === 'all') {
            return sortAscending ? a.id - b.id : b.id - a.id;
          }

          const dateA = a.signed_schedule ? new Date(a.signed_schedule) : new Date(0);
          const dateB = b.signed_schedule ? new Date(b.signed_schedule) : new Date(0);

          // For upcoming, closest date first (ascending)
          if (activeTab === 'upcoming') {
            return dateA.getTime() - dateB.getTime();
          }

          // For past, most recent first (descending)
          if (activeTab === 'past') {
            return dateB.getTime() - dateA.getTime();
          }

          return 0;
        });
    },
    enabled: !!activePortfolio,
  });

  if (isLoading || isLoadingActive) {
    return <div>Loading portfolios...</div>;
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

  const filteredPortfolios = portfolios?.filter((portfolio) => {
    const scheduleDate = portfolio.signed_schedule
      ? new Date(portfolio.signed_schedule)
      : null;
    scheduleDate?.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    now.setHours(0, 0, 0, 0);

    switch (activeTab) {
      case 'past':
        return !scheduleDate || scheduleDate < now;
      case 'upcoming':
        return scheduleDate && scheduleDate > now;
      default:
        return true;
    }
  });

  return (
    <div className="container mx-auto py-8">
      {activePortfolio && (
        <>
          <div className="flex h-44 flex-col items-start justify-end mb-8">
            <div className="flex flex-col justify-between h-full w-full gap-2">
              <div className="flex w-full justify-end items-center gap-2">
                <PortfolioStatusBadge portfolioId={activePortfolio.portfolio_id} />
              </div>
              <h1 className="mb-2 text-7xl font-bold">
                Portfolio {activePortfolio.portfolio_id}
              </h1>
            </div>
          </div>
          <Card className="mb-8">
            <CardContent className="pt-6">
              <dl className="space-y-4">
                {activePortfolio.signed_schedule && (
                  <div>
                    <dd className="text-lg">
                      {format(new Date(activePortfolio.signed_schedule), 'PP')}
                    </dd>
                  </div>
                )}
                {activePortfolio.auctions && activePortfolio.auctions.length > 0 && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Upcoming Auctions</dt>
                    <dd className="text-lg space-y-1">
                      {activePortfolio.auctions.map((auction) => (
                        <div key={auction.auction_id} className="text-sm">
                          {format(new Date(auction.start_date), 'PP')} -{' '}
                          {auction.auction_location}
                          {auction.venue && ` at ${auction.venue}`}
                        </div>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        </>
      )}

      <Separator className="my-6" />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">All Portfolios</h2>
        {activeTab === 'all' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortAscending(!sortAscending)}
            className="gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort {sortAscending ? 'Descending' : 'Ascending'}
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setTab} className="w-full">
        <TabsList className="w-fit flex gap-2 bg-transparent mb-4">
          <TabsTrigger value="all" className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4" />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4" />
            <span>Past</span>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4" />
            <span>Upcoming</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPortfolios?.map((portfolio) => (
              <Card
                key={portfolio.id}
                className="cursor-pointer hover:shadow-lg transition-all h-48 relative group"
                onClick={() => {
                  router.push(`/wiki/library/portfolios/${portfolio.id}`);
                }}
              >
                {portfolio.signed_schedule && (
                  <div className="absolute top-4 right-4 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {format(new Date(portfolio.signed_schedule), 'PP')}
                  </div>
                )}
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-3xl font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                    Portfolio {portfolio.id}
                  </h3>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
