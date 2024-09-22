"use client";

import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { userProfileOptions } from "@/types/userProfileTypes";
import { Button } from "@/components/ui/button";

export default function DashboardFilter() {
  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery(userProfileOptions);

  if (isLoading) {
    return (
      <Card className="relative h-full w-full overflow-visible p-6">
        <div className="animate-pulse">Loading...</div>
      </Card>
    );
  }

  if (isError || !userProfile) {
    return (
      <Card className="relative h-full w-full overflow-visible p-6">
        <div>Error loading profile or no profile available</div>
      </Card>
    );
  }

  return (
    <div className="flex w-full gap-2">
      <Button variant="outline">All</Button>
      {userProfile?.departments?.map((department, index) => (
        <Button variant="outline" key={index}>
          {department}
        </Button>
      ))}
    </div>
  );
}
