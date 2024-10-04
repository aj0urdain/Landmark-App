"use client";

import CompanyCarousel from "@/components/molecules/DashboardCards/CompanyCarousel/CompanyCarousel";
import WelcomeCard from "@/components/molecules/DashboardCards/WelcomeCard/WelcomeCard";
import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";
import DashboardFilter from "@/components/molecules/DashboardFilter/DashboardFilter";
import { Separator } from "@/components/ui/separator";

import BurgessRawsonDashboard from "@/components/molecules/DashboardCards/DepartmentDashboards/BurgessRawsonDashboard/BurgessRawsonDashboard";
import FinanceDashboard from "@/components/molecules/DashboardCards/DepartmentDashboards/FinanceDashboard/FinanceDashboard";
import HumanResourcesDashboard from "@/components/molecules/DashboardCards/DepartmentDashboards/HumanResourcesDashboard/HumanResourcesDashboard";
import MarketingDashboard from "@/components/molecules/DashboardCards/DepartmentDashboards/MarketingDashboard/MarketingDashboard";
import OperationsDashboard from "@/components/molecules/DashboardCards/DepartmentDashboards/OperationsDashboard/OperationsDashboard";
import SeniorLeadershipDashboard from "@/components/molecules/DashboardCards/DepartmentDashboards/SeniorLeadershipDashboard/SeniorLeadershipDashboard";
import TechnologyDashboard from "@/components/molecules/DashboardCards/DepartmentDashboards/TechnologyDashboard/TechnologyDashboard";
import AgencyDashboard from "@/components/molecules/DashboardCards/DepartmentDashboards/AgencyDashboard/AgencyDashboard";
import { userProfileOptions } from "@/types/userProfileTypes";
import { useQuery } from "@tanstack/react-query";
import DesignDashboard from "@/components/molecules/DashboardCards/DepartmentDashboards/DesignDashboard/DesignDashboard";
import DataDashboard from "@/components/molecules/DashboardCards/DepartmentDashboards/DataDashboard/DataDashboard";
import AssetManagementDashboard from "@/components/molecules/DashboardCards/DepartmentDashboards/AssetManagementDashboard/AssetManagementDashboard";
import { useState, useEffect } from "react";
import EmptyDashboard from "@/components/molecules/DashboardCards/DepartmentDashboards/EmptyDashboard/EmptyDashboard";

export default function DashboardPage() {
  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery(userProfileOptions);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  useEffect(() => {
    if (userProfile?.departments) {
      setSelectedFilters(userProfile.departments);
    }
  }, [userProfile?.departments]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !userProfile) {
    return <div>Error loading user profile</div>;
  }

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  const shouldShowDashboard = (department: string) => {
    if (department === "Burgess Rawson") return true;
    return selectedFilters.includes(department);
  };

  return (
    <div className="grid w-full grid-flow-dense flex-col gap-4">
      <DashboardCardRow topRow={true}>
        <div className="col-span-5">
          <WelcomeCard />
        </div>
        <div className="col-span-7 flex items-center justify-center">
          <CompanyCarousel />
        </div>
      </DashboardCardRow>
      <Separator className="my-8" />
      <DashboardFilter onFilterChange={handleFilterChange} />

      {/* Burgess Rawson - Always visible */}
      <BurgessRawsonDashboard />

      {/* Senior Leadership */}
      {shouldShowDashboard("Senior Leadership") && (
        <SeniorLeadershipDashboard />
      )}

      {/* Technology */}
      {shouldShowDashboard("Technology") && <TechnologyDashboard />}

      {/* Agency */}
      {shouldShowDashboard("Agency") && <AgencyDashboard />}

      {/* Finance */}
      {shouldShowDashboard("Finance") && <FinanceDashboard />}

      {/* Human Resources */}
      {shouldShowDashboard("Human Resources") && <HumanResourcesDashboard />}

      {/* Asset Management */}
      {shouldShowDashboard("Asset Management") && <AssetManagementDashboard />}

      {/* Design */}
      {shouldShowDashboard("Design") && <DesignDashboard />}

      {/* Marketing */}
      {shouldShowDashboard("Marketing") && <MarketingDashboard />}

      {/* Operations */}
      {shouldShowDashboard("Operations") && <OperationsDashboard />}

      {/* Data */}
      {shouldShowDashboard("Data") && <DataDashboard />}

      {selectedFilters.length === 0 &&
        !shouldShowDashboard("Burgess Rawson") && <EmptyDashboard />}
    </div>
  );
}
