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
  Users,
  BookText,
  LayoutDashboard,
  CalendarRange,
  WandSparkles,
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
    href: "/create",
    icon: WandSparkles,
    label: "Create",
    access: [],
    disabled: false,
  },
  {
    href: "/sandbox",
    icon: Box,
    label: "Sandbox",
    access: [],
    disabled: false,
  },
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    access: [],
    disabled: false,
  },
  {
    href: "/events",
    icon: CalendarRange,
    label: "Events",
    access: [],
    disabled: false,
  },
  {
    href: "/tasks",
    icon: CheckSquare,
    label: "Tasks",
    access: [],
    disabled: false,
  },
  {
    href: "/news",
    icon: Newspaper,
    label: "News",
    access: [],
    disabled: false,
  },
  {
    href: "/properties",
    icon: HousePlus,
    label: "Properties",
    access: [],
    disabled: false,
  },
  { type: "separator" },
  {
    href: "/library",
    icon: FolderTree,
    label: "Library",
    access: [],
    disabled: false,
  },
  {
    href: "/people",
    icon: Users,
    label: "People",
    access: [],
    disabled: false,
  },
  {
    href: "/wiki",
    icon: BookText,
    label: "Wiki",
    access: [],
    disabled: false,
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

  // const showAdmin = hasDepartmentAccess(
  //   userProfile?.departments,
  //   links[0].access || [],
  // );

  const showAdmin = true;

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
          <NavLink
            href={links[1].href || ""}
            icon={links[1].icon || Home}
            isCollapsed={isCollapsed}
            disabled={links[1].disabled}
          >
            {links[1].label}
          </NavLink>
          <NavLink
            href={links[2].href || ""}
            icon={links[2].icon || Home}
            isCollapsed={isCollapsed}
            disabled={links[2].disabled}
          >
            {links[2].label}
          </NavLink>
          <Separator className="my-4" />
        </>
      )}
      {links.slice(3).map((link, index) => {
        if (link.type === "separator") {
          return <Separator key={`separator-${index}`} className="my-4" />;
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
