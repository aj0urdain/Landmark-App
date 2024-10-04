import React from "react";
import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const BurgessRawsonDashboard = () => {
  return (
    <DashboardCardRow>
      <div className="col-span-12">
        <Card>
          <CardHeader>
            <CardTitle>Burgess Rawson</CardTitle>
            <CardDescription>Burgess Rawson dashboard!</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </DashboardCardRow>
  );
};

export default BurgessRawsonDashboard;
