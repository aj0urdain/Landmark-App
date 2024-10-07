import React from "react";
import DepartmentBadge from "@/components/molecules/DepartmentBadge/DepartmentBadge";
import { Separator } from "@/components/ui/separator";

interface DashboardContainerProps {
  department: string;
  children: React.ReactNode;
  isLast: boolean;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({
  department,
  children,
  isLast,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="ml-4 flex w-full animate-slide-left-fade-in justify-start">
        <DepartmentBadge department={department} list />
      </div>
      <div className="grid w-full gap-6">{children}</div>
      {!isLast && <Separator className="my-12 w-1/3" />}
      {isLast && <div className="mb-2 w-full" />}
    </div>
  );
};

export default DashboardContainer;
