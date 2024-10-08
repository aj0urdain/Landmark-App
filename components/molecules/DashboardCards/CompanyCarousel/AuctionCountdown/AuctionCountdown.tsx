"use client";

import React, { useState, useEffect } from "react";
import Countdown from "react-countdown";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  getUpcomingAuctions,
  Auction,
} from "@/utils/supabase/supabase-queries";
import { ChevronsRight, Gavel } from "lucide-react";

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

  const modifiers = auctions.reduce<Record<string, Date[]>>((acc, auction) => {
    const venueName = auction.auction_locations.name;
    if (venueName in venueColors) {
      acc[venueName] = [new Date(auction.date)];
    }
    return acc;
  }, {});

  const modifiersStyles = Object.entries(venueColors).reduce<
    Record<string, React.CSSProperties>
  >((acc, [venue, color]) => {
    acc[venue] = {
      border: color,
      borderWidth: "2px",
      borderStyle: "solid",
      color: "white",
      fontWeight: "bold",
    };
    return acc;
  }, {});

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
                      date={new Date(auction.date)}
                      renderer={renderer}
                    />
                  )}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(auction.date).toLocaleDateString("en-US", {
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
            <Calendar
              mode="single"
              disabled={true}
              defaultMonth={new Date()}
              className="max-h-full max-w-full overflow-hidden rounded-md border shadow"
            />
          </div>
        ) : (
          <Calendar
            mode="single"
            // selected={
            //   auctions.length > 0 ? new Date(auctions[0].date) : undefined
            // }
            disabled={true}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            defaultMonth={
              auctions.length > 0 ? new Date(auctions[0].date) : undefined
            }
            className="max-h-full max-w-full overflow-hidden rounded-md border shadow"
          />
        )}
      </div>
    </Card>
  );
}
