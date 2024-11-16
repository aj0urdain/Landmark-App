'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { EventCard } from '@/components/molecules/EventCard/EventCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';

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
  bcm_natives: string;
  hsagesmh_w1: string;
  hsagesmh_w2: string;
  portfolio_id: number;
  magazine_print: string;
  press_bookings: string;
  signed_schedule: string;
  magazine_deadline: string;
  adelaide_advertiser: string;
  advertising_period_end: string;
  advertising_period_start: string;
}

const DashboardEventsPreview = () => {
  const { data: activePortfolio, isLoading } = useQuery({
    queryKey: ['activePortfolio'],
    queryFn: async () => {
      const supabase = createBrowserClient();

      const { data, error } = await supabase.rpc('get_active_portfolio_with_auctions');

      if (error) throw error;

      // Add type assertion here
      const typedData = data as unknown as PortfolioWithAuctions;

      // Transform auctions into events
      const auctionEvents = typedData.auctions.map((auction: Auction) => ({
        type: 'auction' as const,
        title: `${auction.auction_location} Auction`,
        start_date: auction.start_date,
        end_date: auction.end_date,
        portfolio_id: typedData.portfolio_id,
        details: auction,
      }));

      // Calculate days until first auction
      const today = new Date();
      const sortedAuctions = auctionEvents.sort(
        (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
      );
      const firstAuction = sortedAuctions[0];
      const daysUntilAuction = Math.ceil(
        (new Date(firstAuction.start_date).getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      console.log(typedData, daysUntilAuction, auctionEvents);

      return {
        ...typedData,
        auctionEvents,
        daysUntilAuction,
      };
    },
  });

  // Get this week's date range
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);

  // Filter events that fall within this week
  const thisWeeksEvents = React.useMemo(() => {
    if (!activePortfolio) return [];

    const events = [];

    // Add auction events
    if (activePortfolio.auctions) {
      events.push(...activePortfolio.auctionEvents);
    }

    // Add other portfolio events
    const portfolioEvents = [
      {
        type: 'magazine_print',
        date: activePortfolio.magazine_print,
        title: 'Magazine Print',
      },
      {
        type: 'signed_schedule',
        date: activePortfolio.signed_schedule,
        title: 'Signed Schedule',
      },
      // Add other portfolio event types as needed
    ];

    events.push(
      ...portfolioEvents
        .filter((event) => event.date)
        .map((event) => ({
          type: event.type,
          title: event.title,
          start_date: event.date,
          portfolio_id: activePortfolio.portfolio_id,
        })),
    );

    // Filter events within this week
    return events.filter((event) => {
      const eventDate = parseISO(event.start_date);
      return isWithinInterval(eventDate, { start: weekStart, end: weekEnd });
    });
  }, [activePortfolio, weekStart, weekEnd]);

  return (
    <Card className="col-span-3 flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          This week at Burgess Rawson
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-full pr-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading events...</p>
          ) : thisWeeksEvents.length > 0 ? (
            <div className="flex flex-col gap-2">
              {thisWeeksEvents.map((event, index) => (
                <EventCard key={index} event={event} variant="preview" />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No events scheduled for this week
            </p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DashboardEventsPreview;
