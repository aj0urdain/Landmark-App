"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InboxIcon, Lock, Unlock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface NotificationSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function Inbox({
  isCollapsed,
  toggleSidebar,
}: NotificationSidebarProps) {
  const [isLocked, setIsLocked] = useState(false);
  const [showContent, setShowContent] = useState(!isCollapsed);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isCollapsed) {
      timer = setTimeout(() => setShowContent(true), 300); // 300ms matches the transition duration
    } else {
      setShowContent(false);
    }
    return () => clearTimeout(timer);
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
    setIsLocked(!isLocked);
  };

  return (
    <div
      className={`flex h-full w-full flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "max-w-16" : "max-w-96"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex h-full flex-col border-l">
        <div
          className={`${isCollapsed ? "justify-center" : "justify-between"} flex items-center p-4`}
        >
          <div className="flex items-center gap-2">
            <InboxIcon className="h-4 w-4" />

            {!isCollapsed ? (
              <h2 className="text-lg font-semibold">Inbox</h2>
            ) : null}
          </div>
          {!isCollapsed && (
            <Button variant="ghost" size="icon" onClick={toggleLock}>
              {isLocked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        {/* Placeholder for notifications */}
        <div className="flex flex-col gap-4 overflow-y-scroll px-4">
          {showContent &&
            new Array(30).fill(null).map((_, index) => (
              <Card key={index} className="animate-slide-down-fade-in p-4">
                <p>Notification {index + 1}</p>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
