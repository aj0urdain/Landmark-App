import React from "react";
import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import DashboardContainer from "@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer";

const AgencyDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Agency" isLast={isLast}>
      <DashboardCardRow>
        <div className="col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>Agency</CardTitle>
              <CardDescription>Agency dashboard!</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default AgencyDashboard;
