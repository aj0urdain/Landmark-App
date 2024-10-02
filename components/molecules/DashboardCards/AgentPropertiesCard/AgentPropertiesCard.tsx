"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@/utils/supabase/client";

import AgentPropertyCard from "./AgentPropertyCard/AgentPropertyCard";
import { Database } from "@/types/supabaseTypes";

type Property = Database["public"]["Tables"]["properties"]["Row"] & {
  streets: Database["public"]["Tables"]["streets"]["Row"] | null;
  suburbs: Database["public"]["Tables"]["suburbs"]["Row"] | null;
  states: Database["public"]["Tables"]["states"]["Row"] | null;
};

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
          setProperties(data as Property[]); // eslint-disable-line
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
