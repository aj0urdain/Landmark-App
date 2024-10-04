"use client";

import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { userProfileOptions } from "@/types/userProfileTypes";
import { Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { DepartmentFilterBadge } from "@/components/atoms/DepartmentFilterBadge/DepartmentFilterBadge";

export default function DashboardFilter({
  onFilterChange,
}: {
  onFilterChange: (departments: string[]) => void;
}) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery({
    ...userProfileOptions,
    enabled: !isInitialized,
  });

  useEffect(() => {
    if (userProfile?.departments && !isInitialized) {
      setSelectedFilters(userProfile.departments);
      onFilterChange(userProfile.departments);
      setIsInitialized(true);
    }
  }, [userProfile, isInitialized, onFilterChange]);

  if (isLoading) {
    return (
      <div className="flex w-full animate-pulse gap-2">
        <DepartmentFilterBadge
          department="Loading.."
          isSelected={false}
          onClick={() => {}}
        />
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

  const handleFilterClick = (department: string) => {
    const newFilters = selectedFilters.includes(department)
      ? selectedFilters.filter((d) => d !== department)
      : [...selectedFilters, department];
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex w-full animate-slide-down-fade-in flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="size-3 text-muted-foreground" />
        <span className="text-xs font-medium uppercase text-muted-foreground">
          Filter
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <DepartmentFilterBadge
          department="Burgess Rawson"
          isSelected={selectedFilters.includes("Burgess Rawson")}
          onClick={() => handleFilterClick("Burgess Rawson")}
        />
        {userProfile?.departments?.map((department) => (
          <DepartmentFilterBadge
            key={department}
            department={department}
            isSelected={selectedFilters.includes(department)}
            onClick={() => handleFilterClick(department)}
          />
        ))}
      </div>
    </div>
  );
}
