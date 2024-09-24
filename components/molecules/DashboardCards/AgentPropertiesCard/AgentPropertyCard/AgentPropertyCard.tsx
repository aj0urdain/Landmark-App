import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Property } from "@/types/portfolioControlsTypes";
import { getProfileFromID } from "@/utils/supabase/supabase-queries";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const AgentPropertyCard = ({
  loading,
  property,
}: {
  loading: boolean;
  property: Property;
}) => {
  const router = useRouter();

  const { data: leadAgentData } = useQuery({
    queryKey: [
      `leadAgentProfile-${property?.lead_agent}`,
      property?.lead_agent,
    ],
    queryFn: async () => await getProfileFromID(property?.lead_agent || ""),
  });

  const handleRedirect = (propertyId: string) => {
    router.push(
      `/sandbox/document-generator/portfolio-page?property=${propertyId}`,
    );
  };

  if (loading) {
    return (
      <div className="grid h-full w-full grid-cols-3 gap-4">
        <Card className="flex h-full flex-col gap-4 p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </Card>
      </div>
    );
  }

  if (!property) {
    return <p>No properties found.</p>;
  }

  return (
    <Card
      key={property.id}
      className={`flex h-full animate-slide-down-fade-in flex-col items-start justify-between p-4`}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <div>
            <Avatar>
              <AvatarImage
                className="h-12 w-12"
                src={
                  leadAgentData?.profile_picture ||
                  "/images/default-profile-picture.png"
                }
                alt={`${leadAgentData?.first_name} ${leadAgentData?.last_name}`}
              />
              <AvatarFallback>
                {leadAgentData?.first_name?.[0]}
                {leadAgentData?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold">
              {leadAgentData?.first_name} {leadAgentData?.last_name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {leadAgentData?.roles?.[0]}
            </p>
          </div>
        </div>
        <Button
          onClick={() => handleRedirect(property.id)}
          className="mt-2"
          size="sm"
          variant="outline"
        >
          Portfolio Page
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-lg font-bold">
          {property.street_number} {property.streets?.street_name}
        </p>
        <p className="text-md text-muted-foreground">
          {property.suburbs?.suburb_name} {property.suburbs?.postcode}
        </p>
        <p className="text-sm text-muted-foreground">
          {property.states?.state_name}
        </p>
      </div>
    </Card>
  );
};

export default AgentPropertyCard;
