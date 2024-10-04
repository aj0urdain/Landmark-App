import React from "react";
import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const AssetManagementDashboard = () => {
  return (
    <DashboardCardRow>
      <div className="col-span-12">
        <Card>
          <CardHeader>
            <CardTitle>Asset Management</CardTitle>
            <CardDescription>Asset Management dashboard!</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </DashboardCardRow>
  );
};

export default AssetManagementDashboard;
