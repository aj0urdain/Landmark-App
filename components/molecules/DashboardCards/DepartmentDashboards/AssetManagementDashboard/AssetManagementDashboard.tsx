import React from "react";
import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import DashboardContainer from "@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer";
const AssetManagementDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Asset Management" isLast={isLast}>
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
    </DashboardContainer>
  );
};

export default AssetManagementDashboard;
