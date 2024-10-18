import React from "react";
import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Logo } from "@/components/atoms/Logo/Logo";
import { LogoWordmark } from "@/components/atoms/LogoWordmark/LogoWordmark";
import { Navigation } from "@/components/molecules/Navigation/Navigation";

interface SidebarProps {
  isCollapsed: boolean;
  sheetMode?: boolean;
}

export function Sidebar({ isCollapsed, sheetMode }: SidebarProps) {
  return (
    <div
      className={`flex h-full w-full flex-col transition-all duration-300 ${
        sheetMode ? "border-none" : "border-r"
      }`}
    >
      <div
        className={`flex h-16 items-center p-4 ${isCollapsed ? "justify-center" : "justify-start"}`}
      >
        <Link href="/">
          {isCollapsed ? (
            <Logo className="h-auto w-5" />
          ) : (
            <LogoWordmark className="ml-4 h-auto w-32" />
          )}
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <Navigation isCollapsed={isCollapsed} />
      </ScrollArea>
    </div>
  );
}
