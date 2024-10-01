"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DepartmentBadge from "@/components/molecules/DepartmentBadge/DepartmentBadge";

const departments = [
  "Technology",
  "Senior Leadership",
  "Agency",
  "Marketing",
  "Asset Management",
  "Finance",
  "Operations",
  "Human Resources",
  "Design",
  "Data",
];

const DepartmentsPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Departments</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start justify-start gap-2">
        {departments.map((department) => (
          <DepartmentBadge
            key={department}
            department={department}
            size="large"
            list
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default DepartmentsPage;
