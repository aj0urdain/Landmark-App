'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Countdown from 'react-countdown';
import { Card } from '@/components/ui/card';

import { ChevronsRight, Gavel } from 'lucide-react';
import {
  CalendarEvent,
  MemoizedEventCalendar,
} from '@/components/molecules/EventCalendar/EventCalendar';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { CalendarLogic } from '@/components/molecules/CalendarLogic/CalendarLogic';

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
  } else if (days > 7) {
    return <span>{days} days</span>;
  } else {
    return (
      <span>
        {days}d {hours}h {minutes}m {seconds}s
      </span>
    );
  }
};

export default function AuctionCountdown() {
  const supabase = createBrowserClient();

  const {
    data: auctions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['upcomingAuctions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auctions')
        .select(
          'id, start_date, auction_locations(name), auction_venues(name), portfolio_id',
        )
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(3);

      if (error) {
        console.error('Error fetching auctions:', error);
        return [];
      }

      return data;
    },
  });

  if (isError) return null;

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [monthDate, setMonthDate] = useState<Date | null>(null);

  useEffect(() => {
    if (auctions?.[0]?.start_date) {
      const firstAuctionDate = new Date(auctions[0].start_date);
      setSelectedDate(firstAuctionDate);
      setMonthDate(firstAuctionDate);
    }
  }, [auctions]);

  const venueColors: Record<string, string> = {
    Sydney: '#f89c28',
    Melbourne: '#cd4f9d',
    Brisbane: '#93d4eb',
  };

  const calendarEvents = auctions?.map((auction) => ({
    type: 'auction',
    start_date: auction.start_date ?? '',
    end_date: null,
    details: { auction_location: auction.auction_locations?.name },
  }));

  const renderCalendarMonth = useMemo(() => {
    return (
      <CalendarLogic auctionsPreview={true} events={calendarEvents as CalendarEvent[]}>
        {(modifiers, modifiersStyles) => {
          const customClassNames = {
            caption_label:
              'text-foreground text-sm font-medium transition-colors duration-500',
          };

          return (
            <MemoizedEventCalendar
              events={calendarEvents ?? []}
              className="w-fit"
              numberOfMonths={1}
              defaultMonth={monthDate ?? new Date()}
              enableNavigation={false}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              classNames={customClassNames}
              selectedDate={selectedDate ?? new Date()}
            />
          );
        }}
      </CalendarLogic>
    );
  }, [calendarEvents, selectedDate, monthDate]);

  const hoverChangeDate = (date: Date) => {
    setSelectedDate(date);
    setMonthDate(new Date(date));
  };

  return (
    <Card className="flex h-full max-h-full w-full items-center justify-between select-none">
      <div className="flex h-full w-full sm:w-1/2 flex-col items-start justify-between p-6">
        <Link href="/events/auctions" className="group">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Gavel className="h-4 w-4" />
            <h1 className="text-sm font-bold group-hover:animated-underline-1 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 group-hover:after:origin-bottom-left group-hover:after:scale-x-100">
              Upcoming Auctions
            </h1>
          </div>
        </Link>

        <div className="flex w-full flex-col gap-6">
          {auctions?.map((auction) => (
            <Link
              key={auction.id}
              href={`/events/auctions/${String(auction.portfolio_id)}/${String(
                auction.auction_locations?.name,
              )}`}
              className="group block w-full"
              onMouseEnter={() => {
                hoverChangeDate(new Date(auction.start_date ?? ''));
              }}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <p className="text-lg font-bold group-hover:animated-underline-1 group-hover:after:bottom-[2px] relative after:absolute after:bottom-[2px] after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 group-hover:after:origin-bottom-left group-hover:after:scale-x-100">
                    {auction.auction_locations?.name ?? 'Location N/A'}
                  </p>
                  <ChevronsRight className="h-3 w-3 text-muted-foreground/80" />
                  <p
                    className={`text-xs font-bold ${
                      selectedDate && selectedDate === new Date(auction.start_date ?? '')
                        ? 'animate-pulse'
                        : ''
                    }`}
                    style={{
                      color:
                        venueColors[
                          auction?.auction_locations?.name as keyof typeof venueColors
                        ] || 'inherit',
                    }}
                  >
                    <Countdown
                      date={new Date(auction.start_date ?? '')}
                      renderer={renderer}
                    />
                  </p>
                </div>
                <p className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  {new Date(auction.start_date ?? '').toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  @{' '}
                  <span className="font-semibold">
                    {auction.auction_venues?.name ?? 'Venue N/A'}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="h-full items-center justify-center p-4 hidden sm:flex sm:w-1/2">
        <div className="flex items-center justify-center">
          {!isLoading && selectedDate && monthDate && renderCalendarMonth}
        </div>
      </div>
    </Card>
  );
}
