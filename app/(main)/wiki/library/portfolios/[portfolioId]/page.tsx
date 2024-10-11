"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";

const PortfolioOverview = ({ portfolioId }: { portfolioId: string }) => {
  // Fetch portfolio data here

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Portfolio Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Display portfolio overview information here */}
        <p>Overview content for Portfolio {portfolioId}</p>
      </CardContent>
    </Card>
  );
};

const PortfolioAuctions = ({ portfolioId }: { portfolioId: string }) => {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Portfolio Auctions</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Auctions for Portfolio {portfolioId}</p>
      </CardContent>
    </Card>
  );
};

const PortfolioMagazine = ({ portfolioId }: { portfolioId: string }) => {
  return <div>PortfolioMagazine for {portfolioId}</div>;
};

const PortfolioProperties = ({ portfolioId }: { portfolioId: string }) => {
  return <div>PortfolioProperties for {portfolioId}</div>;
};

const PortfolioPage = ({ params }: { params: { portfolioId: string } }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";

  const setTab = (newTab: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("tab", newTab);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/wiki/library/portfolios/${params.portfolioId}${query}`);
  };

  return (
    <div className="container mx-auto h-full w-full p-4">
      <div className="flex h-44 flex-col items-start justify-start">
        <h1 className="mb-6 text-5xl font-bold">
          Portfolio {params.portfolioId}
        </h1>
      </div>
      <Separator className="my-6" />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-1/2">
          <TabsTrigger value="overview" className="w-full">
            Overview
          </TabsTrigger>
          <TabsTrigger value="auctions" className="w-full">
            Auctions
          </TabsTrigger>
          <TabsTrigger value="magazine" className="w-full">
            Magazine
          </TabsTrigger>
          <TabsTrigger value="properties" className="w-full">
            Properties
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="h-full w-full">
          <PortfolioOverview portfolioId={params.portfolioId} />
        </TabsContent>
        <TabsContent value="auctions">
          <PortfolioAuctions portfolioId={params.portfolioId} />
        </TabsContent>
        <TabsContent value="magazine">
          <PortfolioMagazine portfolioId={params.portfolioId} />
        </TabsContent>
        <TabsContent value="properties">
          <PortfolioProperties portfolioId={params.portfolioId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioPage;
