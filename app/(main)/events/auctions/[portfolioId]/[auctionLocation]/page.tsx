"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import React from "react";

const AuctionByPortfolioAndLocationPage = () => {
  const { portfolioId, auctionLocation } = useParams();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auction {auctionLocation}</CardTitle>
        <CardDescription>
          Auction description for {auctionLocation} of portfolio {portfolioId}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default AuctionByPortfolioAndLocationPage;
