import React from "react";
import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import DashboardContainer from "@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer";
const DesignDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Design" isLast={isLast}>
      <DashboardCardRow>
        <div className="col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>Design</CardTitle>
              <CardDescription>Design dashboard!</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default DesignDashboard;
