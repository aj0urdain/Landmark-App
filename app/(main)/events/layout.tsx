"use client";

import React from "react";
import { Home, Calendar, Gavel } from "lucide-react";
import SubNavigationMenu from "@/components/molecules/SubNavigationMenu/SubNavigationMenu";

const eventLinks = [
  {
    name: "Home",
    icon: Home,
    href: "/events",
  },
  {
    name: "Calendar",
    icon: Calendar,
    href: "/events/calendar",
  },
  {
    name: "Auctions",
    icon: Gavel,
    href: "/events/auctions",
  },
];

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <SubNavigationMenu title="Events" links={eventLinks} rootPath="/events" />
      <div className="p-4">{children}</div>
    </div>
  );
}
