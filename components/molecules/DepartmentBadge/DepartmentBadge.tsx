import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getDepartmentInfo } from "@/utils/getDepartmentInfo";

interface DepartmentBadgeProps {
  department: string;
  list?: boolean;
  size?: "small" | "medium" | "large";
}

const DepartmentBadge: React.FC<DepartmentBadgeProps> = ({
  department,
  list = false,
  size = "medium",
}) => {
  const departmentInformation = getDepartmentInfo(department);

  if (!departmentInformation) {
    return null;
  }

  const { icon: Icon, color, link } = departmentInformation;

  const sizeClasses = {
    small: {
      button: "px-2 py-1",
      icon: "h-3 w-3",
      text: "text-xs",
    },
    medium: {
      button: "px-3 py-1",
      icon: "h-4 w-4",
      text: "text-sm",
    },
    large: {
      button: "px-4 py-2",
      icon: "h-5 w-5",
      text: "text-base",
    },
  };

  return (
    <Link href={`/wiki/departments/${link}`} passHref>
      <Button
        variant={list ? "link" : "outline"}
        size="sm"
        className={cn(
          "flex items-center gap-1",
          color,
          list ? "h-auto p-0" : "bg-transparent",
          "transition-colors",
          "p-0",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center",
            sizeClasses[size].icon,
          )}
        >
          <Icon className="h-full w-full" />
        </div>
        <span className={cn("font-medium", sizeClasses[size].text)}>
          {department}
        </span>
      </Button>
    </Link>
  );
};

export default DepartmentBadge;
