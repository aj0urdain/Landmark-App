"use client";

import { NavLink } from "@/components/atoms/NavLink/NavLink";
import {
  Home,
  Newspaper,
  CheckSquare,
  Mail,
  Box,
  LineChart,
  HousePlus,
  ShieldCheck,
  FolderTree,
  FileCode,
} from "lucide-react";
import React from "react";
import { useQuery } from "@tanstack/react-query";

import { hasDepartmentAccess } from "@/utils/permissions";
import { Separator } from "@/components/ui/separator";
import { userProfileOptions } from "@/types/userProfileTypes";

interface NavigationProps {
  isCollapsed: boolean;
}

const links = [
  {
    href: "/admin",
    icon: ShieldCheck,
    label: "Admin",
    access: ["Technology", "Senior Leadership Team"],
    disabled: true,
  },
  {
    href: "/dashboard",
    icon: Home,
    label: "Dashboard",
    access: [],
    disabled: false,
  },
  {
    href: "/news",
    icon: Newspaper,
    label: "News",
    access: [],
    disabled: true,
  },
  {
    href: "/tasks",
    icon: CheckSquare,
    label: "Tasks",
    access: [],
    disabled: true,
  },
  {
    href: "/properties",
    icon: HousePlus,
    label: "Properties",
    access: [],
    disabled: true,
  },
  {
    href: "/sandbox",
    icon: Box,
    label: "Sandbox",
    access: [],
    disabled: false,
  },
  {
    href: "/mailouts",
    icon: Mail,
    label: "Mailouts",
    access: [],
    disabled: true,
  },
  {
    href: "/analytics",
    icon: LineChart,
    label: "Analytics",
    access: [],
    disabled: true,
  },
  {
    href: "/directory",
    icon: FolderTree,
    label: "Directory",
    access: [],
    disabled: true,
  },

  { type: "separator" },
  {
    href: "/updates",
    icon: FileCode,
    label: " Updates",
    access: [],
    disabled: false,
  },
];

export const Navigation = React.memo(function Navigation({
  isCollapsed,
}: NavigationProps) {
  const { data: userProfile } = useQuery(userProfileOptions);

  const showAdmin = hasDepartmentAccess(
    userProfile?.departments,
    links[0].access || [],
  );

  return (
    <nav className="flex flex-col gap-2 pt-4">
      {showAdmin && (
        <>
          <NavLink
            href={links[0].href || ""}
            icon={links[0].icon || Home}
            isCollapsed={isCollapsed}
            disabled={links[0].disabled}
          >
            {links[0].label}
          </NavLink>
          <Separator className="my-2 w-2/3" />
        </>
      )}
      {links.slice(1).map((link, index) => {
        if (link.type === "separator") {
          return (
            <Separator key={`separator-${index}`} className="my-2 w-2/3" />
          );
        }
        return (
          <NavLink
            key={link.href}
            href={link.href || ""}
            icon={link.icon ?? Home}
            isCollapsed={isCollapsed}
            disabled={link.disabled}
          >
            {link.label}
          </NavLink>
        );
      })}
    </nav>
  );
});
