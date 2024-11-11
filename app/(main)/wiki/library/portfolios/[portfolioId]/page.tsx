'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Building2, Gavel, BookOpen, Map } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Database } from '@/types/supabaseTypes';
import { createBrowserClient } from '@/utils/supabase/client';

type PortfolioMagazine = Database['public']['Tables']['portfolio_magazines']['Row'];

const PortfolioMagazine = ({ portfolioId }: { portfolioId: string }) => {
  const supabase = createBrowserClient();

  const { data: magazines, isLoading } = useQuery({
    queryKey: ['portfolio-magazines', portfolioId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_magazines')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PortfolioMagazine[];
    },
  });

  if (isLoading) return <div>Loading magazines...</div>;
  if (!magazines?.length) return <div>No magazines found</div>;

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
              {magazine.stack_image_path && (
                <div className="relative h-40 w-full">
                  <Image
                    src={magazine.stack_image_path}
                    alt={magazine.title || 'Magazine cover'}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
              <h3 className="font-semibold">{magazine.title}</h3>
              <p className="text-sm text-muted-foreground">
                Published: {new Date(magazine.created_at).toLocaleDateString()}
              </p>
              {magazine.file_path && (
                <a
                  href={magazine.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Read Now
                </a>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
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
        <h1 className="mb-2 text-4xl font-bold">Portfolio {params.portfolioId}</h1>
        <p className="text-xl text-muted-foreground">
          Portfolio ID: {params.portfolioId}
        </p>
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
          {/* <PortfolioOverview portfolio={portfolioData} /> */}
        </TabsContent>
        <TabsContent value="auctions">
          {/* <PortfolioAuctions auctions={portfolioData.auctions} /> */}
        </TabsContent>
        <TabsContent value="magazine">
          <PortfolioMagazine portfolioId={params.portfolioId} />
        </TabsContent>
        <TabsContent value="properties">
          {/* <PortfolioProperties properties={portfolioData.properties} /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
