'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Building2, Gavel, BookOpen, Map } from 'lucide-react';

// Dummy data
const portfolioData = {
  id: 'PTFL001',
  name: 'Urban Core Commercial',
  value: '$250M',
  propertyCount: 12,
  occupancyRate: '92%',
  annualReturn: '8.5%',
  description:
    'A diverse portfolio of prime commercial properties in major urban centers, focusing on office spaces and retail locations.',
  auctions: [
    { id: 'A001', property: 'Downtown Plaza', date: '2023-08-15', startingBid: '$5M' },
    {
      id: 'A002',
      property: 'Tech Park Office',
      date: '2023-09-22',
      startingBid: '$7.2M',
    },
    {
      id: 'A003',
      property: 'Riverside Retail',
      date: '2023-10-05',
      startingBid: '$3.8M',
    },
  ],
  magazines: [
    { id: 'M001', title: 'Q2 2023 Portfolio Insights', date: '2023-07-01' },
    { id: 'M002', title: 'Urban Core Market Trends', date: '2023-05-15' },
    { id: 'M003', title: 'Sustainability in Commercial Real Estate', date: '2023-03-30' },
  ],
  properties: [
    {
      id: 'P001',
      name: 'Skyline Tower',
      type: 'Office',
      location: 'New York, NY',
      size: '50,000 sqft',
    },
    {
      id: 'P002',
      name: 'Harbor View Mall',
      type: 'Retail',
      location: 'San Francisco, CA',
      size: '75,000 sqft',
    },
    {
      id: 'P003',
      name: 'Tech Hub Campus',
      type: 'Mixed-Use',
      location: 'Austin, TX',
      size: '100,000 sqft',
    },
  ],
};

const PortfolioOverview = ({ portfolio }: { portfolio: typeof portfolioData }) => {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Portfolio Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Description</h3>
          <p className="text-muted-foreground">{portfolio.description}</p>
        </div>
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Value</span>
              <span className="text-2xl font-bold">{portfolio.value}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Properties</span>
              <span className="text-2xl font-bold">{portfolio.propertyCount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Occupancy Rate</span>
              <span className="text-2xl font-bold">{portfolio.occupancyRate}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Annual Return</span>
              <span className="text-2xl font-bold">{portfolio.annualReturn}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PortfolioAuctions = ({ auctions }: { auctions: typeof portfolioData.auctions }) => {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Upcoming Auctions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {auctions.map((auction) => (
            <li
              key={auction.id}
              className="flex items-center justify-between border-b pb-4 last:border-b-0"
            >
              <div>
                <h3 className="font-semibold">{auction.property}</h3>
                <p className="text-sm text-muted-foreground">Date: {auction.date}</p>
              </div>
              <Badge variant="secondary">Starting Bid: {auction.startingBid}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const PortfolioMagazine = ({
  magazines,
}: {
  magazines: typeof portfolioData.magazines;
}) => {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Portfolio Magazines</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {magazines.map((magazine) => (
            <li
              key={magazine.id}
              className="flex flex-col items-start space-y-2 rounded-md border p-4"
            >
              <h3 className="font-semibold">{magazine.title}</h3>
              <p className="text-sm text-muted-foreground">Published: {magazine.date}</p>
              <button className="text-primary hover:underline">Read Now</button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const PortfolioProperties = ({
  properties,
}: {
  properties: typeof portfolioData.properties;
}) => {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Portfolio Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card key={property.id}>
              <CardHeader>
                <CardTitle>{property.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Type:</strong> {property.type}
                </p>
                <p>
                  <strong>Location:</strong> {property.location}
                </p>
                <p>
                  <strong>Size:</strong> {property.size}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function PortfolioPage({ params }: { params: { portfolioId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') ?? 'overview';

  const setTab = (newTab: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('tab', newTab);
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/wiki/library/portfolios/${params.portfolioId}${query}`);
  };

  return (
    <div className="container mx-auto h-full w-full p-4">
      <div className="flex h-44 flex-col items-start justify-start">
        <h1 className="mb-2 text-4xl font-bold">{portfolioData.name}</h1>
        <p className="text-xl text-muted-foreground">Portfolio ID: {portfolioData.id}</p>
      </div>
      <Separator className="my-6" />
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-1/2">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="auctions" className="flex items-center space-x-2">
            <Gavel className="h-4 w-4" />
            <span>Auctions</span>
          </TabsTrigger>
          <TabsTrigger value="magazine" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Magazine</span>
          </TabsTrigger>
          <TabsTrigger value="properties" className="flex items-center space-x-2">
            <Map className="h-4 w-4" />
            <span>Properties</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="h-full w-full">
          <PortfolioOverview portfolio={portfolioData} />
        </TabsContent>
        <TabsContent value="auctions">
          <PortfolioAuctions auctions={portfolioData.auctions} />
        </TabsContent>
        <TabsContent value="magazine">
          <PortfolioMagazine magazines={portfolioData.magazines} />
        </TabsContent>
        <TabsContent value="properties">
          <PortfolioProperties properties={portfolioData.properties} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
