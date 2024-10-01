import React from "react";
import {
  CpuIcon,
  Award,
  Building,
  Megaphone,
  HandCoins,
  BadgeDollarSign,
  Cog,
  UserSearch,
  PenTool,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const departmentInfo = [
  {
    name: "Technology",
    icon: CpuIcon,
    color: "text-blue-500 border-blue-500",
    link: "technology",
  },
  {
    name: "Senior Leadership",
    icon: Award,
    color: "text-purple-500 border-purple-500",
    link: "senior-leadership",
  },
  {
    name: "Agency",
    icon: Building,
    color: "text-green-500 border-green-500",
    link: "agency",
  },
  {
    name: "Marketing",
    icon: Megaphone,
    color: "text-yellow-500 border-yellow-500",
    link: "marketing",
  },
  {
    name: "Asset Management",
    icon: HandCoins,
    color: "text-indigo-500 border-indigo-500",
    link: "asset-management",
  },
  {
    name: "Finance",
    icon: BadgeDollarSign,
    color: "text-red-500 border-red-500",
    link: "finance",
  },
  {
    name: "Operations",
    icon: Cog,
    color: "text-orange-500 border-orange-500",
    link: "operations",
  },
  {
    name: "Human Resources",
    icon: UserSearch,
    color: "text-pink-500 border-pink-500",
    link: "human-resources",
  },
  {
    name: "Design",
    icon: PenTool,
    color: "text-teal-500 border-teal-500",
    link: "design",
  },
  {
    name: "Data",
    icon: Database,
    color: "text-cyan-500 border-cyan-500",
    link: "data",
  },
];

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
  const departmentInformation = departmentInfo.find(
    (info) => info.name === department,
  );

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
