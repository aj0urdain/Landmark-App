"use client";

import { NavLink } from "@/components/atoms/NavLink/NavLink";
import {
  Home,
  Newspaper,
  CheckSquare,
  Box,
  HousePlus,
  ShieldCheck,
  FileCode,
  BookText,
  LayoutDashboard,
  CalendarRange,
  WandSparkles,
} from "lucide-react";
import React from "react";
// import { useQuery } from "@tanstack/react-query";

// import { hasDepartmentAccess } from "@/utils/permissions";
import { Separator } from "@/components/ui/separator";
// import { userProfileOptions } from "@/types/userProfileTypes";

import {
  LibraryBig,
  Component,
  MapPin,
  Users,
  GraduationCap,
} from "lucide-react";

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
    href: "/wiki",
    icon: BookText,
    label: "Wiki",
    access: [],
    disabled: false,
    subsections: [
      { name: "Home", href: "/wiki", icon: Home },
      { name: "Library", href: "/wiki/library", icon: LibraryBig },
      { name: "Departments", href: "/wiki/departments", icon: Component },
      { name: "Branches", href: "/wiki/branches", icon: MapPin },
      { name: "People", href: "/wiki/people", icon: Users },
      { name: "Learn", href: "/wiki/learn", icon: GraduationCap },
    ],
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
  // const { data: userProfile } = useQuery(userProfileOptions);

  // const showAdmin = hasDepartmentAccess(
  //   userProfile?.departments,
  //   links[0].access || [],
  // );

  const showAdmin = true;

  return (
    <nav className="flex flex-col gap-2 pt-4">
      {showAdmin && (
        <>
          {links.slice(0, 3).map((link) => (
            <NavLink
              key={link.href}
              href={link.href || ""}
              icon={link.icon ?? Home}
              isCollapsed={isCollapsed}
              disabled={link.disabled}
            >
              {link.label}
            </NavLink>
          ))}
          <Separator className="my-4" />
        </>
      )}
      {links.slice(3).map((link) => {
        if (link.type === "separator") {
          return <Separator key={`separator-${link.href}`} className="my-4" />;
        }
        return (
          <NavLink
            key={link.href}
            href={link.href || ""}
            icon={link.icon ?? Home}
            isCollapsed={isCollapsed}
            disabled={link.disabled}
            subsections={link.subsections}
          >
            {link.label}
          </NavLink>
        );
      })}
    </nav>
  );
});
