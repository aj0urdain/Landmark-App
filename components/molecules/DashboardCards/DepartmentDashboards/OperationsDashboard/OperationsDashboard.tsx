import React from "react";
import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import DashboardContainer from "@/components/molecules/DashboardCards/DashboardContainer/DashboardContainer";

const OperationsDashboard = ({ isLast }: { isLast: boolean }) => {
  return (
    <DashboardContainer department="Operations" isLast={isLast}>
      <DashboardCardRow>
        <div className="col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>Operations dashboard!</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardCardRow>
    </DashboardContainer>
  );
};
export default OperationsDashboard;
