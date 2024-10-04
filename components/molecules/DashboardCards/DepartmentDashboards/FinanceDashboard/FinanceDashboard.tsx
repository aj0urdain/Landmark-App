import React from "react";
import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const FinanceDashboard = () => {
  return (
    <DashboardCardRow>
      <div className="col-span-12">
        <Card>
          <CardHeader>
            <CardTitle>Finance</CardTitle>
            <CardDescription>Finance dashboard!</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </DashboardCardRow>
  );
};
export default FinanceDashboard;
