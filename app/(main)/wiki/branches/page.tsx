'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MapPin, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

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
    <div className="my-12">
      {groupedBranches &&
        Object.entries(groupedBranches).map(([country, states]) => (
          <div key={country} className="mb-12 flex flex-col gap-2">
            <Label className="text-2xl font-bold pb-6 leading-normal flex items-center gap-4 w-fit">
              <div className="flex items-center gap-4 shrink-0">
                {country === 'Australia' && (
                  <Image
                    src="/images/flags/australian-flag.webp"
                    alt="Australia"
                    width={40}
                    height={40}
                  />
                )}
                {country === 'International' && (
                  <Image
                    src="/images/flags/earth-flag.jpg"
                    alt="International"
                    width={40}
                    height={40}
                  />
                )}
                {country}
              </div>
              <Separator className="w-full" />
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    <CardHeader className="bg-primary/5 flex flex-row items-center justify-between gap-2">
                      <div className="flex items-center gap-4">
                        <h1 className="text-xl font-semibold">{state}</h1>
                        {(state === 'Victoria' ||
                          state === 'New South Wales' ||
                          state === 'Queensland') && (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1 px-2 py-1 border-blue-400/25 hover:border-blue-400/50 text-blue-400 select-none"
                          >
                            <Sparkles className="h-3 w-3" />
                            National
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {locations.length}{' '}
                        {locations.length === 1 ? 'location' : 'locations'}
                      </p>
                    </CardHeader>
                    <CardContent className="grid gap-6 p-6">
                      {locations.map((branch) => (
                        <Link
                          href={`/wiki/branches/${String(branch.name).toLowerCase()}`}
                          key={branch.name}
                        >
                          <Card
                            key={branch.name}
                            className="flex items-start gap-4 rounded-xl border p-4 transition-colors hover:bg-muted"
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
                          </Card>
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}
