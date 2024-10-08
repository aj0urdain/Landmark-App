"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <CardDescription>
          The layout of this page is still under development!
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-4 items-start justify-start gap-12">
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
