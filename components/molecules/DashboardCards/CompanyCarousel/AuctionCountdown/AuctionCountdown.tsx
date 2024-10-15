"use client";

import React, { useState, useEffect } from "react";
import Countdown from "react-countdown";
import { Card } from "@/components/ui/card";
import {
  getUpcomingAuctions,
  Auction,
} from "@/utils/supabase/supabase-queries";
import { ChevronsRight, Gavel } from "lucide-react";
import {
  EventCalendar,
  CalendarEvent,
} from "@/components/molecules/EventCalendar/EventCalendar";

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
  const [isClient, setIsClient] = useState(false);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    const upcomingAuctions = await getUpcomingAuctions();
    setAuctions(upcomingAuctions);
    setIsLoading(false);
  };

  const venueColors: Record<string, string> = {
    Sydney: "#f89c28",
    Melbourne: "#cd4f9d",
    Brisbane: "#93d4eb",
  };

  const calendarEvents: CalendarEvent[] = auctions.map((auction) => ({
    type: "auction",
    start_date: auction.start_date,
    end_date: null,
    details: { auction_location: auction.auction_locations.name },
  }));

  return (
    <Card className="flex h-full w-full items-center justify-between">
      <div className="flex h-full w-1/2 flex-col items-start justify-between p-6">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Gavel className="h-4 w-4" />
          <h1 className="text-sm font-bold">Upcoming Auctions</h1>
        </div>

        <div className="flex w-full flex-col gap-6">
          {auctions.map((auction) => (
            <div key={auction.id}>
              <p className="flex items-center gap-1 text-lg font-bold">
                {auction.auction_locations.name || "Location N/A"}{" "}
                <span className="text-xs">
                  <ChevronsRight className="h-3 w-3" />
                </span>{" "}
                <span
                  className="text-xs"
                  style={{
                    color:
                      venueColors[
                        auction.auction_locations
                          .name as keyof typeof venueColors
                      ] || "inherit",
                  }}
                >
                  {isClient && (
                    <Countdown
                      date={new Date(auction.start_date)}
                      renderer={renderer}
                    />
                  )}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(auction.start_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}{" "}
                @{" "}
                <span className="font-semibold">
                  {auction.auction_venues.name || "Venue N/A"}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex h-full w-1/2 items-center justify-center p-4">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <EventCalendar
              events={[]}
              className="max-h-full max-w-full overflow-hidden rounded-md border shadow"
            />
          </div>
        ) : (
          <EventCalendar
            events={calendarEvents}
            className="max-h-full max-w-full overflow-hidden rounded-md border shadow"
          />
        )}
      </div>
    </Card>
  );
}
