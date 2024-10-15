"use client";

import React from "react";
import { CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import AuctionOverview from "@/components/molecules/AuctionPageContent/AuctionOverview/AuctionOverview";
import AuctionProperties from "@/components/molecules/AuctionPageContent/AuctionProperties/AuctionProperties";
import AuctionVenue from "@/components/molecules/AuctionPageContent/AuctionVenue/AuctionVenue";
import AuctionAttendees from "@/components/molecules/AuctionPageContent/AuctionAttendees/AuctionAttendees";
import AuctionComments from "@/components/molecules/AuctionPageContent/AuctionComments/AuctionComments";
import {
  Building,
  Gavel,
  Info,
  MapPin,
  MessageCircle,
  Users,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Countdown from "react-countdown";

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
  } else if (days < 0) {
    return <span>Auction has ended!</span>;
  } else if (days > 7 && days > 0) {
    return <span>Auction starts in {days} days!</span>;
  } else {
    return (
      <span>
        {days}d {hours}h {minutes}m {seconds}s
      </span>
    );
  }
};

const AuctionByPortfolioAndLocationPage = () => {
  const { portfolioId, auctionLocation } = useParams();

  // You'll need to fetch the actual auction date from your data source
  const auctionDate = new Date("2024-10-16T12:00:00"); // Example date

  return (
    <div className="h-full w-full">
      <CardContent className="p-6">
        <div className="relative flex min-h-96 items-end justify-start overflow-hidden rounded-3xl">
          <Image
            src={`/images/auctionImages/crown-casino-melbourne.jpg`}
            alt={`${auctionLocation} Auction`}
            width={1000}
            height={1000}
            className="absolute left-0 top-0 h-full w-full object-cover object-bottom opacity-40"
          />
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-background via-background/90 to-background/50"></div>

          <div className="z-10 flex items-center p-6">
            <div>
              <div className="flex flex-col items-start justify-start gap-2">
                <div className="flex items-center gap-2">
                  <Gavel className="mr-2 h-10 w-10" />

                  <h1 className="text-4xl font-black">
                    {auctionLocation} Auction
                  </h1>
                </div>
                <Badge variant="secondary" className="text-2xl">
                  Portfolio {portfolioId}
                </Badge>
              </div>
              <p className="text-lg">Crown Casino</p>
              <div className="mt-4 text-2xl font-bold">
                <Countdown date={auctionDate} renderer={renderer} />
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-6 h-full">
          <TabsList className="bg-transparent">
            <TabsTrigger value="overview">
              <Info className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="properties">
              <Building className="mr-2 h-4 w-4" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="venue">
              <MapPin className="mr-2 h-4 w-4" />
              Venue
            </TabsTrigger>
            <TabsTrigger value="attendees">
              <Users className="mr-2 h-4 w-4" />
              Attendees
            </TabsTrigger>
            <TabsTrigger value="comments">
              <MessageCircle className="mr-2 h-4 w-4" />
              Comments
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="h-full">
            <AuctionOverview />
          </TabsContent>
          <TabsContent value="properties">
            <AuctionProperties />
          </TabsContent>
          <TabsContent value="venue">
            <AuctionVenue />
          </TabsContent>
          <TabsContent value="attendees">
            <AuctionAttendees />
          </TabsContent>
          <TabsContent value="comments">
            <AuctionComments />
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  );
};

export default AuctionByPortfolioAndLocationPage;
