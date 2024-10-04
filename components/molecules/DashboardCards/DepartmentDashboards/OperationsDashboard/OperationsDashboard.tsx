import React from "react";
import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const OperationsDashboard = () => {
  return (
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
  );
};
export default OperationsDashboard;
