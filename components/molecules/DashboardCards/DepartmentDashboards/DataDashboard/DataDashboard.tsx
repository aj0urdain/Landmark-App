import React from "react";
import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import DashboardContainer from "@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer";
const DataDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Data" isLast={isLast}>
      <DashboardCardRow>
        <div className="col-span-12">
          <Card className="h-full w-full">
            <CardHeader>
              <CardTitle>Data</CardTitle>
              <CardDescription>Data dashboard!</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default DataDashboard;
