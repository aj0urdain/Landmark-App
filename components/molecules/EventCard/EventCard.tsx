import React from "react";
import { Card } from "@/components/ui/card";
import { Event } from "../CompanyCalendar/CompanyCalendar";
import { format } from "date-fns";
import {
  Book,
  Calendar,
  Gavel,
  Mailbox,
  Newspaper,
  Cake,
  Briefcase,
} from "lucide-react";

import Link from "next/link";

interface EventCardProps {
  event: Event;
  variant: "preview" | "full" | "featured";
}

export function EventCard({ event, variant }: EventCardProps) {
  const renderEventContent = () => {
    const baseContent = (
      <>
        {getEventIcon(event.type)}
        <div>
          <p
            className={`font-medium ${variant === "preview" ? "text-sm" : "text-base"}`}
          >
            {event.title}
          </p>
          <p
            className={`text-muted-foreground ${variant === "preview" ? "text-xs" : "text-sm"}`}
          >
            {formatEventDate()}
          </p>
        </div>
      </>
    );

    if (variant === "full" || variant === "featured") {
      return (
        <>
          {baseContent}
          {renderAdditionalInfo()}
        </>
      );
    }

    return baseContent;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "auction":
        return <Gavel className="h-4 w-4" />;
      case "magazine_print":
        return <Book className="h-4 w-4" />;
      case "signed_schedule":
        return <Calendar className="h-4 w-4" />;
      case "magazine_deadline":
        return <Newspaper className="h-4 w-4" />;
      case "advertising_period":
        return <Mailbox className="h-4 w-4" />;
      case "birthday":
        return <Cake className="h-4 w-4" />;
      case "work_anniversary":
        return <Briefcase className="h-4 w-4" />;
      default:
        return null;
    }
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
      case "auction":
        return (
          <div className="mt-2 text-sm">
            <p>Venue: {event.details.venue}</p>
            <p>Location: {event.details.auction_location}</p>
          </div>
        );
      case "advertising_period":
        return (
          <div className="mt-2 text-sm">
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
      className={`flex items-center gap-2 border p-3 ${variant === "featured" ? "bg-muted" : ""}`}
    >
      {renderEventContent()}
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
