import React from "react";
import { format } from "date-fns";
import { getEventColor, getEventTypeInfo } from "@/utils/eventTypeInfo";
import { Event } from "@/components/molecules/CompanyCalendar/CompanyCalendar";
import Image from "next/image";

import ReactTimeAgo from "react-time-ago";
import { Badge } from "@/components/ui/badge";
import { BookOpenText } from "lucide-react";

interface AuctionCardProps {
  event: Event;
  variant: "preview" | "full" | "featured";
}

export function AuctionCard({ event, variant }: AuctionCardProps) {
  const { icon: Icon } = getEventTypeInfo(event.type);
  const { bgColor } = getEventColor(event);

  const getBackgroundImage = () => {
    switch (event.details.auction_location) {
      case "Brisbane":
        return "/images/auctionImages/the-hilton-brisbane.webp";
      case "Melbourne":
        return "/images/auctionImages/crown-casino-melbourne.jpg";
      case "Sydney":
        return "/images/auctionImages/sydney-opera-house-sydney.webp";
      default:
        return null;
    }
  };

  const backgroundImage = getBackgroundImage();

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-between overflow-hidden ${variant !== "preview" && "min-h-40"}`}
    >
      {variant !== "preview" && (
        <Badge
          variant="secondary"
          className="absolute right-0 top-0 z-20 rounded-bl-xl rounded-br-none rounded-tl-none rounded-tr-none bg-opacity-50 px-6 py-2"
        >
          <BookOpenText className="mr-2 h-3 w-3" />
          {event.portfolio_id}
        </Badge>
      )}
      {variant !== "preview" && backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt={`${event.details.auction_location} background`}
            fill
            style={{ objectFit: "cover" }}
            className="absolute left-0 top-0 h-full w-full opacity-20 grayscale transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0"
          />
          <div className="absolute left-0 top-0 h-full w-full rounded-lg bg-gradient-to-b from-transparent to-background opacity-50" />
        </>
      )}
      <div className="relative z-10 flex h-full w-full flex-col justify-between p-3">
        {(variant === "full" || variant === "featured") && (
          <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:font-semibold">
            <p>{format(event.start_date, "MMMM d, yyyy")}</p>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <Icon
              className={`h-4 w-4 ${
                variant === "preview"
                  ? "mt-1"
                  : "mt-1.5 group-hover:mt-0 group-hover:h-6 group-hover:w-6"
              } transition-all duration-500 group-hover:animate-gavel-hit group-hover:opacity-100`}
              style={{ color: bgColor }}
            />
            <div className="flex flex-col gap-1">
              <p
                className={`${
                  variant === "preview"
                    ? "text-sm"
                    : "text-xl group-hover:text-2xl"
                } font-bold transition-all duration-500 group-hover:text-foreground`}
                style={
                  {
                    "--hover-color": bgColor,
                  } as React.CSSProperties
                }
              >
                <span className="group-hover:text-[color:var(--hover-color)]">
                  {event.title}
                </span>
              </p>
              <p
                className={`animate-slide-down-fade-in text-muted-foreground ${variant === "preview" ? "text-xs" : "text-sm"} group-hover:hidden`}
              >
                {format(event.start_date, "h:mm a")} @{" "}
                <span className="font-semibold">{event.details.venue}</span>
              </p>
              <p
                className={`hidden text-muted-foreground transition-all duration-1000 group-hover:block group-hover:animate-slide-up-fade-in ${variant === "preview" ? "text-xs" : "text-sm"}`}
              >
                starts{" "}
                <ReactTimeAgo
                  date={new Date(event.start_date)}
                  locale="en-US"
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
