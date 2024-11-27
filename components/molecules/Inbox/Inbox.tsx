'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Eye,
  EyeOff,
  InboxIcon,
  Lock,
  Unlock,
  User,
  Users,
  Building,
  Archive,
  Hammer,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface NotificationSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  sheetMode?: boolean;
}

export function Inbox({
  isCollapsed,
  toggleSidebar,
  sheetMode,
}: NotificationSidebarProps) {
  const [isLocked, setIsLocked] = useState(false);
  const [showContent, setShowContent] = useState(!isCollapsed);
  const [visibleSections, setVisibleSections] = useState({
    me: true,
    groups: true,
    company: true,
  });
  const [lockMessage, setLockMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isCollapsed) {
      timer = setTimeout(() => {
        setShowContent(true);
      }, 300);
    } else {
      setShowContent(false);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isCollapsed]);

  const handleMouseEnter = () => {
    if (!isLocked && isCollapsed) {
      toggleSidebar();
    }
  };

  const handleMouseLeave = () => {
    if (!isLocked && !isCollapsed) {
      toggleSidebar();
    }
  };

  const toggleLock = () => {
    if (lockMessage) return;
    setIsLocked((prev) => !prev);
    setLockMessage(isLocked ? 'Inbox Undocked!' : 'Inbox Docked!');
    setTimeout(() => {
      setLockMessage(null);
    }, 2000);
  };

  const toggleSectionVisibility = (section: keyof typeof visibleSections) => {
    setVisibleSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderCollapsedNotifications = () => {
    return (
      <div className="space-y-4 w-full">
        {(['me', 'groups', 'company'] as const).map((section) => {
          return (
            <div
              key={section}
              className="flex w-full flex-col items-center text-muted-foreground justify-center gap-1 py-3 rounded-full border border-muted bg-muted/25 px-2"
            >
              {section === 'me' && <User className="h-4 w-4" />}
              {section === 'groups' && <Users className="h-4 w-4" />}
              {section === 'company' && <Building className="h-4 w-4" />}
              <span className="mt-1 text-xs">
                <Hammer className="h-3 w-3 text-muted-foreground/75" />
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderNotifications = (type: 'inbox' | 'archive') => {
    return (
      <div className="w-full">
        {(['me', 'groups', 'company'] as const).map((section) => {
          return (
            <div key={section} className="w-full">
              <div className="flex w-full items-center justify-between min-w-full">
                <h3 className="flex items-center gap-1 text-xs font-semibold capitalize text-muted-foreground">
                  {section === 'me' && <User className="h-3 w-3" />}
                  {section === 'groups' && <Users className="h-3 w-3" />}
                  {section === 'company' && <Building className="h-3 w-3" />}
                  {section}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="group/eyeButton transition-all duration-300 ease-in-out"
                  onClick={() => {
                    toggleSectionVisibility(section);
                  }}
                >
                  {visibleSections[section] ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted group-hover/eyeButton:text-muted-foreground transition-all duration-300 ease-in-out" />
                  )}
                </Button>
              </div>
              {visibleSections[section] && (
                <Card
                  className={cn(
                    'relative mb-2 p-4 select-none',
                    type === 'archive'
                      ? 'opacity-50 animate-slide-up-fade-in'
                      : 'animate-slide-down-fade-in',
                  )}
                >
                  <div className="flex items-start gap-2">
                    <Hammer className="mt-1 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <h1 className="line-clamp-2 text-xs font-semibold text-muted-foreground">
                        Under Construction!
                      </h1>
                      <p className="mt-1 text-xs text-muted">
                        This feature is under development.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`flex h-full max-h-screen w-full flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'max-w-16' : 'max-w-64'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`flex h-full flex-col ${
          sheetMode ? 'p-4 px-6' : 'space-y-6 border-l p-4'
        }`}
      >
        <div className="flex-shrink-0">
          {isCollapsed ? (
            <div className="flex justify-center">
              <InboxIcon className="mb-5 mt-1 h-5 w-6 text-muted-foreground" />
            </div>
          ) : (
            <Button
              variant="outline"
              className={`${
                isLocked ? 'border-foreground text-foreground' : 'text-muted-foreground'
              } ${sheetMode ? 'hidden' : 'w-full'} group justify-between text-xs`}
              onClick={toggleLock}
            >
              {lockMessage ? (
                <span className="animate-slide-left-fade-in">{lockMessage}</span>
              ) : (
                <>
                  <p className="block group-hover:hidden">
                    Inbox {isLocked ? 'Docked' : 'Undocked'}
                  </p>
                  <p className="hidden group-hover:block">
                    {isLocked ? 'Undock' : 'Dock'} Inbox?
                  </p>
                </>
              )}
              {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            </Button>
          )}
        </div>
        {isCollapsed ? (
          <div className="flex flex-grow justify-center">
            {renderCollapsedNotifications()}
          </div>
        ) : (
          <div className="flex flex-grow flex-col overflow-hidden">
            <Tabs
              defaultValue="inbox"
              className="flex h-full flex-col items-center justify-center"
            >
              <TabsList className="mb-2 grid w-full flex-shrink-0 grid-cols-2 bg-transparent">
                <TabsTrigger
                  value="inbox"
                  className="group py-2 data-[state=active]:border-b data-[state=active]:border-foreground data-[state=active]:font-bold data-[state=active]:text-foreground"
                >
                  <InboxIcon className="mr-1.5 h-3 w-3 group-data-[state=active]:animate-bounce" />
                  <p className="text-xs">Inbox</p>
                </TabsTrigger>
                <TabsTrigger
                  value="archive"
                  className="group py-2 data-[state=active]:border-b data-[state=active]:border-foreground data-[state=active]:font-bold data-[state=active]:text-foreground"
                >
                  <Archive className="mr-1.5 h-3 w-3 group-data-[state=active]:animate-bounce" />
                  <p className="text-xs">Archive</p>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="inbox" className="flex-grow overflow-hidden w-full">
                <ScrollArea className="h-full w-full">
                  {showContent && renderNotifications('inbox')}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="archive" className="flex-grow overflow-hidden w-full">
                <ScrollArea className="h-full w-full">
                  {showContent && renderNotifications('archive')}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
