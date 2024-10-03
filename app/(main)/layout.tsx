"use client";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

import { useState } from "react";

import { Sidebar } from "@/components/molecules/Sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Header } from "@/components/molecules/Header/Header";
import { UserProfileManager } from "@/components/atoms/UserProfileManager/UserProfileManager";
import { Inbox } from "@/components/molecules/Inbox/Inbox";

TimeAgo.addDefaultLocale(en);

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isInboxCollapsed, setIsInboxCollapsed] = useState(true);

  const toggleLeftSidebar = () =>
    setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed);
  const toggleInbox = () => setIsInboxCollapsed(!isInboxCollapsed);

  return (
    <div className="flex h-screen overflow-hidden">
      <UserProfileManager />
      <div
        className={`relative hidden flex-col transition-all duration-300 ease-in-out md:flex ${
          isLeftSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <Sidebar isCollapsed={isLeftSidebarCollapsed} />
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-1/2 -translate-y-1/2 transform rounded-full shadow-md"
          onClick={toggleLeftSidebar}
        >
          {isLeftSidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="mx-4 flex h-full w-full items-center justify-center overflow-y-scroll py-4 2xl:mx-auto">
          <div className="h-full w-full max-w-6xl">{children}</div>
        </main>
      </div>
      <div
        className={`relative hidden w-full flex-col transition-all duration-300 ease-in-out md:flex ${
          isInboxCollapsed ? "max-w-16" : "max-w-64"
        }`}
      >
        <Inbox isCollapsed={isInboxCollapsed} toggleSidebar={toggleInbox} />
      </div>
    </div>
  );
}
