import React from "react";
import { Card } from "@/components/ui/card";
import { Event } from "../CompanyCalendar/CompanyCalendar";
import { format } from "date-fns";

import { getEventColor, getEventTypeInfo } from "@/utils/eventTypeInfo";

import Link from "next/link";
import { AuctionCard } from "./AuctionCard/AuctionCard";

interface EventCardProps {
  event: Event;
  variant: "preview" | "full" | "featured";
}

export function EventCard({ event, variant }: EventCardProps) {
  const renderEventContent = () => {
    if (event.type === "auction") {
      return <AuctionCard event={event} variant={variant} />;
    }

    const { icon: Icon, bgColor } = getEventTypeInfo(event.type);

    return (
      <div className="flex items-start gap-2 p-3">
        <Icon
          className={`h-4 w-4`}
          style={{
            color: typeof bgColor === "string" ? bgColor : bgColor.default,
          }}
        />
        <div className="flex flex-col gap-1">
          <p className={`${variant === "preview" ? "text-sm" : "text-base"}`}>
            {event.title}
          </p>
          <p
            className={`text-muted-foreground ${variant === "preview" ? "text-xs" : "text-sm"}`}
          >
            {formatEventDate()}
          </p>
        </div>
      </div>
    );
  };

  const formatEventDate = () => {
    if (event.type === "advertising_period" && event.end_date) {
      return `${format(new Date(event.start_date), "MMM d")} - ${format(new Date(event.end_date), "MMM d, yyyy")}`;
    }
    return format(new Date(event.start_date), "MMM d, yyyy");
  };

  const renderAdditionalInfo = () => {
    if (variant !== "full" && variant !== "featured") return null;

    switch (event.type) {
      case "advertising_period":
        return (
          <div className="text-sm">
            <p>
              Duration:{" "}
              {event.end_date
                ? `${Math.ceil((new Date(event.end_date).getTime() - new Date(event.start_date).getTime()) / (1000 * 60 * 60 * 24))} days`
                : "N/A"}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const cardContent = (
    <Card
      className={`group box-border flex h-full w-full flex-col gap-2 overflow-hidden border transition-all duration-300 ${
        variant === "featured" ? "bg-muted" : ""
      } hover:border-[color:var(--hover-border-color)]`}
      style={
        {
          "--hover-border-color": getEventColor(event).bgColor,
        } as React.CSSProperties
      }
    >
      {renderEventContent()}
      {renderAdditionalInfo()}
    </Card>
  );

  if (event.type === "auction") {
    return (
      <Link
        href={`/events/auctions/${event.portfolio_id}/${event.details.auction_location}`}
      >
        {cardContent}
      </Link>
    );
  } else if (
    [
      "magazine_print",
      "signed_schedule",
      "magazine_deadline",
      "advertising_period",
      "press_bookings",
      "hsagesmh_w1",
      "hsagesmh_w2",
      "bcm_natives",
      "afr",
      "adelaide_advertiser",
    ].includes(event.type)
  ) {
    return (
      <Link
        href={`/wiki/library/portfolios/${event.portfolio_id}?tab=overview`}
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
