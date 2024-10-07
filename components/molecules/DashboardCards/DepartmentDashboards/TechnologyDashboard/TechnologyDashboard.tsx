import React from "react";
import { DashboardCardRow } from "../../DashboardCardRow/DashboardCardRow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import DashboardContainer from "@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer";

const TechnologyDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Technology" isLast={isLast}>
      <DashboardCardRow height={240}>
        <div className="col-span-4">
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Technology</CardTitle>
              <CardDescription>Technology dashboard!</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="col-span-4">
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Technology</CardTitle>
              <CardDescription>Technology dashboard!</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="col-span-4">
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Technology</CardTitle>
              <CardDescription>Technology dashboard!</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default TechnologyDashboard;
