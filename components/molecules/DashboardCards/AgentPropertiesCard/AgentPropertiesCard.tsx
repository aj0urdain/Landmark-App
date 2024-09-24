"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@/utils/supabase/client";

import AgentPropertyCard from "./AgentPropertyCard/AgentPropertyCard";

interface Property {
  id: string;
  street_number: string;
  streets: { street_name: string } | null;
  suburbs: { suburb_name: string; postcode: string } | null;
  states: { state_name: string; short_name: string } | null;
  associated_agents: string[] | null;
  property_type: string;
  lead_agent: string;
}

export default function Component() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);

      const supabase = createBrowserClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        console.log(userId);
        setUserId(user.id);

        const { data, error } = await supabase
          .from("properties")
          .select(
            `id, street_number, streets(street_name), suburbs(suburb_name, postcode), states(state_name, short_name), associated_agents, property_type, lead_agent`,
          );

        if (error) {
          console.error("Error fetching properties: ", error.message);
        } else {
          setProperties(data); // eslint-disable-line
        }
      }

      setLoading(false);
    };

    fetchProperties();
  }, [userId]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="grid h-full grid-cols-3 gap-4">
        {properties &&
          properties.map((property) => (
            <AgentPropertyCard
              key={property.id}
              loading={loading}
              property={property} // eslint-disable-line
            />
          ))}
      </div>
    </div>
  );
}
