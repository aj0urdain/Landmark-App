"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createBrowserClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

interface Property {
  id: string;
  street_number: string;
  streets: { street_name: string } | null;
  suburbs: { suburb_name: string; postcode: string } | null;
  states: { state_name: string; short_name: string } | null;
  associated_agents: string[] | null;
  property_type: string;
}

export default function Component() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleRedirect = (propertyId: string) => {
    router.push(
      `/sandbox/document-generator/portfolio-page?property=${propertyId}`,
    );
  };

  // Fetch properties for the logged-in user (Yosh Mendis)
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);

      const supabase = createBrowserClient();

      // Get current user's ID
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("properties")
          .select(
            `id, street_number, streets(street_name), suburbs(suburb_name, postcode), states(state_name, short_name), associated_agents, property_type`,
          )
          .eq("lead_agent", user.id);

        if (error) {
          console.error("Error fetching properties: ", error.message);
        } else {
          setProperties(data as unknown as Property[]);
        }
      }

      setLoading(false);
    };

    fetchProperties();
  }, []);

  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader>
        <CardTitle>Agent Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {loading ? (
            <p>Loading properties...</p>
          ) : properties.length > 0 ? (
            <ul>
              {properties.map((property, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>
                    {property?.street_number} {property?.streets?.street_name},{" "}
                    {property?.suburbs?.suburb_name}{" "}
                    {property?.suburbs?.postcode},{" "}
                    {property?.states?.short_name}
                  </span>
                  <Button onClick={() => handleRedirect(property.id)} size="sm">
                    Generate Portfolio
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No properties found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
