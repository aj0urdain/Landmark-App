import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@/utils/supabase/client";

import PropertySelector from "./PropertySelector/PropertySelector";
import ToDoSection from "./ToDoSection/ToDoSection";
import SectionSelector from "./SectionSelector/SectionSelector";
import SectionControls from "./SectionControls/SectionControls";
import { Property, SectionName } from "@/types/portfolioControlsTypes";
import { useQuery } from "@tanstack/react-query";
import {
  getProfileFromID,
  UserProfile,
} from "@/utils/supabase/supabase-queries";
import { User } from "lucide-react";
import SaveControls from "./SaveControls/SaveControls";

interface PropertyData {
  id: string;
  street_number: string;
  streets: { street_name: string };
  suburbs: { suburb_name: string };
  lead_agent: string;
}

const PortfolioPageControls = ({
  isDisabled,
  canEdit,
  renderError,
  isLoading,
}: {
  isDisabled: boolean;
  canEdit: boolean;
  renderError: boolean;
  isLoading: boolean;
}) => {
  const [selectedSection, setSelectedSection] = useState<SectionName | null>(
    null,
  );
  const [properties, setProperties] = useState<Property[]>([]);
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [propertySelectorOpen, setPropertySelectorOpen] = useState(false);

  const [leadAgentProfile, setLeadAgentProfile] = useState<UserProfile | null>(
    null,
  );

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedPropertyId = searchParams.get("property");

  const { data: propertyData } = useQuery({
    queryKey: ["property", selectedPropertyId],
    queryFn: async () => {
      if (!selectedPropertyId) return null;
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("properties")
        .select(
          `
          id,
          street_number,
          streets (street_name),
          suburbs (suburb_name),
          lead_agent
        `,
        )
        .eq("id", selectedPropertyId)
        .single();

      if (error) throw error;
      return data as unknown as PropertyData;
    },
    enabled: !!selectedPropertyId,
  });

  useEffect(() => {
    if (propertyData?.lead_agent) {
      getProfileFromID(propertyData.lead_agent).then((profile) => {
        setLeadAgentProfile(profile);
      });
    }
  }, [propertyData?.lead_agent]);

  useEffect(() => {
    const fetchProperties = async () => {
      const supabase = createBrowserClient();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const { data, error } = await supabase.from("properties").select(`
          id,
          street_number,
          streets(street_name),
          suburbs(suburb_name, postcode),
          states(state_name, short_name),
          associated_agents,
          property_type,
          lead_agent
        `);

      if (error) {
        console.log(`property fetch fucked it`);
        console.error("Error fetching properties:", error);
        return;
      }

      console.log(data);

      setProperties(data as unknown as Property[]);

      const myProps = data.filter(
        (prop) =>
          prop.lead_agent === userId ||
          prop?.associated_agents?.includes(userId as string),
      );
      setMyProperties(myProps as unknown as Property[]);

      const allProps = data.filter(
        (prop) =>
          prop.lead_agent !== userId &&
          !prop?.associated_agents?.includes(userId as string),
      );
      setAllProperties(allProps as unknown as Property[]);
    };

    fetchProperties();
  }, []);

  const handlePropertySelect = (id: string) => {
    // Create a new URLSearchParams object with only the property parameter
    const newParams = new URLSearchParams();
    newParams.set("property", id);

    // Push the new URL, effectively removing all other parameters
    router.push(`${pathname}?${newParams.toString()}`, {
      scroll: false,
    });
    setPropertySelectorOpen(false);
  };

  return (
    <Card className="h-full w-[45%] p-4">
      <div className="mb-4">
        <Label>Choose a property</Label>
        <PropertySelector
          properties={properties}
          myProperties={myProperties}
          allProperties={allProperties}
          selectedPropertyId={selectedPropertyId}
          onSelect={handlePropertySelect}
          propertySelectorOpen={propertySelectorOpen}
          setPropertySelectorOpen={setPropertySelectorOpen}
        />
        <CardContent className="p-0 px-2 pt-6">
          {propertyData ? (
            <div
              className="animate-slide-down-fade-in text-sm"
              key={propertyData.id}
            >
              <p className="text-lg font-bold">
                {propertyData.street_number} {propertyData.streets?.street_name}
                , {propertyData?.suburbs?.suburb_name}
              </p>
              <p className="flex items-center gap-1 text-muted-foreground">
                <User className="h-4 w-4" />
                {leadAgentProfile?.first_name} {leadAgentProfile?.last_name}
              </p>
            </div>
          ) : selectedPropertyId === "sandbox" ? (
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-bold">Sandbox mode</h1>
              <p className="text-sm text-muted-foreground">
                This is a sandbox mode. Feel free to chop and change as you
                please, but you can&apos;t save a sandbox!
              </p>
            </div>
          ) : isLoading ? (
            <p className="animate-pulse text-sm text-muted-foreground">
              Loading property data...
            </p>
          ) : (
            <p>No property selected</p>
          )}
          {renderError && <p>Error loading property data</p>}
        </CardContent>
      </div>
      {!isDisabled && canEdit && (
        <div className="mb-4">
          <Separator className="my-8" />
          <div className="flex flex-col gap-4">
            <SaveControls />
            <ToDoSection />
            <SectionSelector
              onValueChange={(value) =>
                setSelectedSection(value as SectionName)
              }
            />
          </div>
          <Separator className="my-8" />
          {selectedSection && (
            <div className="mt-4">
              <SectionControls selectedSection={selectedSection} />
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default PortfolioPageControls;
