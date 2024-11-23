'use client';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

import { useState } from 'react';

import { Sidebar } from '@/components/molecules/Sidebar/Sidebar';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Header } from '@/components/molecules/Header/Header';
import { UserProfileManager } from '@/components/atoms/UserProfileManager/UserProfileManager';
import { Inbox } from '@/components/molecules/Inbox/Inbox';
import { AccessControl } from '@/components/atoms/AccessControl/AccessControl';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TooltipProvider } from '@/components/ui/tooltip';
import { RoutePermissionControl } from '@/components/atoms/RoutePermissionControl/RoutePermissionControl';

TimeAgo.addDefaultLocale(en);

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isInboxCollapsed, setIsInboxCollapsed] = useState(false);

  const toggleLeftSidebar = () => {
    setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed);
  };
  const toggleInbox = () => {
    setIsInboxCollapsed(!isInboxCollapsed);
  };

  return (
    <TooltipProvider>
      <div
        className={`flex h-screen overflow-hidden bg-gradient-to-br from-transparent via-muted/15 to-transparent`}
      >
        <UserProfileManager />
        <div
          className={`relative hidden flex-col transition-all duration-300 ease-in-out xl:flex ${
            isLeftSidebarCollapsed ? 'w-20' : 'w-64'
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
          <ScrollArea className="flex-1">
            <main className="mx-auto px-6 flex h-full w-full items-center justify-center py-4 2xl:mx-auto">
              <div className="h-full w-full max-w-6xl">
                <RoutePermissionControl>{children}</RoutePermissionControl>
              </div>
            </main>
          </ScrollArea>
        </div>
        <div
          className={`relative hidden w-full flex-col transition-all duration-300 ease-in-out xl:flex ${
            isInboxCollapsed ? 'max-w-16' : 'max-w-64'
          }`}
        >
          <Inbox isCollapsed={isInboxCollapsed} toggleSidebar={toggleInbox} />
        </div>
      </div>
    </TooltipProvider>
  );
}
