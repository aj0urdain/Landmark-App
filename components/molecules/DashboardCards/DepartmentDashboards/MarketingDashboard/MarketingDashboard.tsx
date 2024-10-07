import React from "react";
import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import DashboardContainer from "@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer";

const MarketingDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Marketing" isLast={isLast}>
      <DashboardCardRow>
        <div className="col-span-12 h-full">
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Marketing</CardTitle>
              <CardDescription>Marketing dashboard!</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardCardRow>
    </DashboardContainer>
  );
};
export default MarketingDashboard;
