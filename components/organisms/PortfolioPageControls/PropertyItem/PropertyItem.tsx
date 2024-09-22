"use client";

import React, { useEffect, useState } from "react";

import {
  LucideIcon,
  FileClock,
  Brush,
  UserRoundPen,
  CircleCheck,
  User,
} from "lucide-react";

import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { CommandItem } from "@/components/ui/command";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
  getProfileFromID,
  UserProfile,
} from "@/utils/supabase/supabase-queries";

type PropertyStatus =
  | "inProgress"
  | "pendingDesignApproval"
  | "pendingAgentApproval"
  | "approved"
  | null;

interface PropertyItemProps {
  id: string;
  address: string;
  agentId: string;
  icon: LucideIcon;
  isSelected: boolean;
  onSelect: (id: string) => void;
  status: PropertyStatus;
  type: string;
}

export const PropertyItem: React.FC<PropertyItemProps> = ({
  id,
  address,
  agentId,
  icon: Icon,
  isSelected,
  onSelect,
  status,
  type,
}) => {
  const [agentProfile, setAgentProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (agentId && agentId !== "Sandbox") {
      getProfileFromID(agentId).then((profile) => {
        setAgentProfile(profile);
      });
    }
  }, [agentId]);

  const getStatusIcon = (status: PropertyStatus) => {
    switch (status) {
      case "inProgress":
        return <FileClock className="h-4 w-4 text-yellow-500" />;
      case "pendingDesignApproval":
        return <Brush className="h-4 w-4 text-blue-500" />;
      case "pendingAgentApproval":
        return <UserRoundPen className="h-4 w-4 text-purple-500" />;
      case "approved":
        return <CircleCheck className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: PropertyStatus) => {
    switch (status) {
      case "inProgress":
        return "In Progress";
      case "pendingDesignApproval":
        return "Pending Design Approval";
      case "pendingAgentApproval":
        return "Pending Agent Approval";
      case "approved":
        return "Approved";
      default:
        return "No status";
    }
  };

  const renderAgentInfo = () => {
    if (agentId === "Sandbox") {
      return (
        <span className="text-sm text-muted-foreground">
          Make a page from scratch
        </span>
      );
    }
    return (
      <>
        {type !== "sandbox" && (
          <User className="h-3 w-3 text-muted-foreground" />
        )}
        <span className="text-sm text-muted-foreground">
          {agentProfile
            ? `${agentProfile.first_name} ${agentProfile.last_name}`
            : "Loading..."}
        </span>
      </>
    );
  };

  return (
    <CommandItem onSelect={() => onSelect(id)}>
      <div className="flex w-full items-center">
        <div className="mr-2 flex flex-col items-center">
          <Icon className="mb-1 h-4 w-4" />
          {status && (
            <HoverCard>
              <HoverCardTrigger>{getStatusIcon(status)}</HoverCardTrigger>
              <HoverCardContent>
                <p>{getStatusText(status)}</p>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
        <div className="flex flex-grow flex-col">
          <span>{address}</span>
          <div className="flex items-center gap-1">{renderAgentInfo()}</div>
        </div>
        <CheckIcon
          className={cn(
            "ml-2 h-4 w-4 flex-shrink-0",
            isSelected ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
    </CommandItem>
  );
};
