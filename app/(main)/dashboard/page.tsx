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

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  useEffect(() => {
    if (userProfile?.departments) {
      const allDepartments = ["Burgess Rawson", ...userProfile.departments];
      setSelectedDepartments(allDepartments);
    }
  }, [userProfile?.departments]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !userProfile) {
    return <div>Error loading user profile</div>;
  }

  const handleFilterChange = (departments: string[]) => {
    setSelectedDepartments(departments);
  };

  const renderDashboards = () => {
    return selectedDepartments.map((department, index) => {
      const isLast = index === selectedDepartments.length - 1;
      switch (department) {
        case "Burgess Rawson":
          return <BurgessRawsonDashboard key={department} isLast={isLast} />;
        case "Senior Leadership":
          return <SeniorLeadershipDashboard key={department} isLast={isLast} />;
        case "Technology":
          return <TechnologyDashboard key={department} isLast={isLast} />;
        case "Agency":
          return <AgencyDashboard key={department} isLast={isLast} />;
        case "Finance":
          return <FinanceDashboard key={department} isLast={isLast} />;
        case "Human Resources":
          return <HumanResourcesDashboard key={department} isLast={isLast} />;
        case "Asset Management":
          return <AssetManagementDashboard key={department} isLast={isLast} />;
        case "Design":
          return <DesignDashboard key={department} isLast={isLast} />;
        case "Marketing":
          return <MarketingDashboard key={department} isLast={isLast} />;
        case "Operations":
          return <OperationsDashboard key={department} isLast={isLast} />;
        case "Data":
          return <DataDashboard key={department} isLast={isLast} />;
        default:
          return null;
      }
    });
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="grid w-full gap-4">
        <DashboardCardRow height={320}>
          <div className="col-span-5 h-full max-h-[320px]">
            <WelcomeCard />
          </div>
          <div className="col-span-7 flex h-full max-h-[320px] items-center justify-center">
            <CompanyCarousel />
          </div>
        </DashboardCardRow>
      </div>

      <div className="flex flex-col gap-8">
        <Separator className="w-full" />

        <DashboardFilter onFilterChange={handleFilterChange} />
        <Separator className="w-16" />
      </div>

      <div className="flex flex-col gap-6">
        {renderDashboards()}
        {selectedDepartments.length === 0 && <EmptyDashboard />}
      </div>
    </div>
  );
}
