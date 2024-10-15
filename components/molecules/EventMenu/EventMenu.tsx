"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { LogoWordmark } from "@/components/atoms/LogoWordmark/LogoWordmark";
import { Dot } from "@/components/atoms/Dot/Dot";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Gavel, Home } from "lucide-react";

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

const EventsMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="sticky -top-4 z-30 bg-gradient-to-b from-transparent via-background/50 to-background backdrop-blur-3xl">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <LogoWordmark className="h-8 w-auto" />
            <Dot size="small" className="mt-1 animate-pulse bg-foreground" />
            <h1 className="mt-0.5 font-lexia font-bold uppercase tracking-wider">
              Events
            </h1>
          </div>
          <div className="flex items-center gap-8">
            {eventLinks.map((link) => (
              <Button
                onClick={() => {
                  router.push(link.href);
                }}
                key={link.name}
                variant="ghost"
                className={cn(
                  "flex items-center gap-1 p-0 px-2 transition-all duration-150",
                  pathname === link.href
                    ? "border-b-2 border-foreground text-foreground hover:bg-transparent"
                    : "text-muted-foreground hover:border-b-2 hover:border-foreground hover:bg-transparent hover:text-foreground",
                )}
              >
                <link.icon className="h-3 w-3" />
                {link.name}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
    </div>
  );
};

export default EventsMenu;
