'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge, MapPin, Waypoints } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import Image from 'next/image';

// Add state order configuration
const stateOrder = {
  Victoria: 1,
  'New South Wales': 2,
  Queensland: 3,
};

export default function BranchesPage() {
  const supabase = createBrowserClient();

  const { data: branches, isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branches')
        .select(
          `
          *,
          states (state_name, short_name),
          streets (street_name),
          suburbs (suburb_name, postcode)
        `,
        )
        .order('branch_name');

      if (error) throw error;
      return data;
    },
  });

  // Group branches by country, then by state
  const groupedBranches = branches?.reduce(
    (acc, branch) => {
      const countryName = branch.country_id === 1 ? 'Australia' : 'International';
      const stateName = branch.states?.state_name || 'Other';

      // Initialize country if it doesn't exist
      if (!acc[countryName]) {
        acc[countryName] = {};
      }

      // Initialize state if it doesn't exist
      if (!acc[countryName][stateName]) {
        acc[countryName][stateName] = [];
      }

      // Add branch to appropriate state
      acc[countryName][stateName].push({
        name: branch.branch_name,
        address: [
          branch.level_number && `Level ${branch.level_number}`,
          branch.suite_number && `Suite ${branch.suite_number}`,
          branch.street_number,
          branch.streets?.street_name,
          // branch.suburbs?.suburb_name,
          // branch.states?.short_name,
          // branch.suburbs?.postcode,
        ]
          .filter(Boolean)
          .join(', '),
      });

      return acc;
    },
    {} as Record<string, Record<string, { name: string; address: string }[]>>,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative flex min-h-48 items-end justify-start overflow-hidden rounded-3xl">
        <Image
          src={`/images/auctionImages/crown-casino-melbourne.jpg`}
          alt={` Auction`}
          width={1000}
          height={1000}
          className="absolute left-0 top-0 h-full w-full object-cover object-bottom opacity-40"
        />
        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-background via-background/90 to-background/50"></div>

        <div className="z-10 flex items-center p-6">
          <div>
            <div className="flex flex-col items-start justify-start gap-2">
              <div className="flex items-center gap-2">
                <Waypoints className="mr-2 h-10 w-10" />

                <h1 className="text-4xl font-black">Our Branches</h1>
              </div>
              <div>
                <p className="text-lg text-muted-foreground">
                  We have a number of branches across Australia and Internationally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        {groupedBranches &&
          Object.entries(groupedBranches).map(([country, states]) => (
            <div key={country} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{country}</h2>
              <div className="grid gap-8">
                {Object.entries(states)
                  .sort(([stateA], [stateB]) => {
                    // Get the order for each state (default to 999 if not in stateOrder)
                    const orderA = stateOrder[stateA as keyof typeof stateOrder] || 999;
                    const orderB = stateOrder[stateB as keyof typeof stateOrder] || 999;

                    // Sort by the order first
                    if (orderA !== orderB) {
                      return orderA - orderB;
                    }

                    // If neither state has a specific order (or they're equal),
                    // sort alphabetically
                    return stateA.localeCompare(stateB);
                  })
                  .map(([state, locations]) => (
                    <Card key={state} className="overflow-hidden">
                      <CardHeader className="bg-primary/5">
                        <CardTitle className="text-xl font-semibold">{state}</CardTitle>
                        <CardDescription>
                          {locations.length}{' '}
                          {locations.length === 1 ? 'location' : 'locations'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
                        {locations.map((branch) => (
                          <div
                            key={branch.name}
                            className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted"
                          >
                            <div className="rounded-full bg-primary/10 p-2">
                              <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{branch.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {branch.address}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
