import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DepartmentBadge from "@/components/molecules/DepartmentBadge/DepartmentBadge";

const MarketingDepartmentPage = () => {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>
          <DepartmentBadge department="Marketing" size="large" list />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Marketing</h2>
            <p className="text-sm text-gray-500">
              This is the marketing department page.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketingDepartmentPage;
