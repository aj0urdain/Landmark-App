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

const departmentIcons = [
  { name: "Technology", icon: CpuIcon, color: "text-blue-500 border-blue-500" },
  {
    name: "Senior Leadership",
    icon: Award,
    color: "text-purple-500 border-purple-500",
  },
  { name: "Agency", icon: Building, color: "text-green-500 border-green-500" },
  {
    name: "Marketing",
    icon: Megaphone,
    color: "text-yellow-500 border-yellow-500",
  },
  {
    name: "Asset Management",
    icon: HandCoins,
    color: "text-indigo-500 border-indigo-500",
  },
  {
    name: "Finance",
    icon: BadgeDollarSign,
    color: "text-red-500 border-red-500",
  },
  { name: "Operations", icon: Cog, color: "text-orange-500 border-orange-500" },
  {
    name: "Human Resources",
    icon: UserSearch,
    color: "text-pink-500 border-pink-500",
  },
  { name: "Design", icon: PenTool, color: "text-teal-500 border-teal-500" },
  { name: "Data", icon: Database, color: "text-cyan-500 border-cyan-500" },
];

interface DepartmentBadgeProps {
  department: string;
  list?: boolean;
  onClick?: () => void;
  size?: "small" | "medium" | "large";
}

const DepartmentBadge: React.FC<DepartmentBadgeProps> = ({
  department,
  list = false,
  onClick,
  size = "medium",
}) => {
  const departmentInfo = departmentIcons.find(
    (icon) => icon.name === department,
  );

  if (!departmentInfo) {
    return null;
  }

  const { icon: Icon, color } = departmentInfo;

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
      onClick={onClick}
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
  );
};

export default DepartmentBadge;
