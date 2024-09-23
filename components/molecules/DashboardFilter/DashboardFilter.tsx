"use client";

import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { userProfileOptions } from "@/types/userProfileTypes";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";

export default function DashboardFilter() {
  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery(userProfileOptions);

  if (isLoading) {
    return (
      <div className="flex w-full animate-pulse gap-2">
        <Button variant="outline">Loading..</Button>
      </div>
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
    <div className="flex w-full animate-slide-down-fade-in items-center gap-2">
      <Filter className="mr-2 size-4" />
      <Button variant="default" size="sm" className="rounded-full px-6 py-2">
        All
      </Button>
      {userProfile?.departments?.map((department, index) => (
        <Button
          variant="outline"
          key={index}
          size="sm"
          className="rounded-full px-6 py-2 text-muted-foreground"
        >
          {department}
        </Button>
      ))}
    </div>
  );
}
