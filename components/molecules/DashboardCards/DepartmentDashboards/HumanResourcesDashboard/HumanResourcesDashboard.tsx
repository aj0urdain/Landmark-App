import React from "react";
import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import DashboardContainer from "@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer";

const HumanResourcesDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Human Resources" isLast={isLast}>
      <DashboardCardRow>
        <div className="col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>Human Resources</CardTitle>
              <CardDescription>Human Resources dashboard!</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardCardRow>
    </DashboardContainer>
  );
};

export default HumanResourcesDashboard;
