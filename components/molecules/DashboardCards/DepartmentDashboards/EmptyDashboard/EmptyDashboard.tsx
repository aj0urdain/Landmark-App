import React from "react";
import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const EmptyDashboard = () => {
  return (
    <DashboardCardRow>
      <div className="col-span-12">
        <Card>
          <CardHeader>
            <CardTitle>No departments selected</CardTitle>
            <CardDescription>
              Please select one or more departments to view their dashboards.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </DashboardCardRow>
  );
};

export default EmptyDashboard;
