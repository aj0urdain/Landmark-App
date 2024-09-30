import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VictoriaIcon } from "@/components/atoms/VictoriaIcon/VictoriaIcon";
import { NewSouthWalesIcon } from "@/components/atoms/NewSouthWalesIcon/NewSouthWalesIcon";
import { QueenslandIcon } from "@/components/atoms/QueenslandIcon/QueenslandIcon";

interface StateInfo {
  name: string;
  icon: React.ComponentType<{ className?: string; fill?: string }>;
  color: string;
}

const stateIcons: Record<string, StateInfo> = {
  VIC: {
    name: "Victoria",
    icon: VictoriaIcon,
    color: "text-muted-foreground",
  },
  NSW: {
    name: "New South Wales",
    icon: NewSouthWalesIcon,
    color: "text-red-500 border-red-500",
  },
  QLD: {
    name: "Queensland",
    icon: QueenslandIcon,
    color: "text-yellow-500 border-yellow-500",
  },
};

interface BranchBadgeProps {
  state?: string;
  list?: boolean;
  onClick?: () => void;
  size?: "small" | "medium" | "large";
}

const BranchBadge: React.FC<BranchBadgeProps> = ({
  state,
  list = false,
  onClick,
  size = "medium",
}) => {
  const stateInfo = state ? stateIcons[state.toUpperCase()] : null;

  if (!stateInfo) {
    return null;
  }

  const { name, icon: Icon, color } = stateInfo;

  const sizeClasses = {
    small: {
      button: "p-0",
      icon: "h-3 w-3",
      text: "text-xs",
    },
    medium: {
      button: "p-0",
      icon: "h-4 w-4",
      text: "text-sm",
    },
    large: {
      button: "p-0",
      icon: "h-5 w-5",
      text: "text-lg",
    },
  };

  return (
    <Button
      variant={list ? "link" : "outline"}
      size="sm"
      className={cn(
        "m-0 flex items-center gap-1 p-0",
        color,
        list ? "h-auto" : "bg-transparent",
        "transition-colors",
        sizeClasses[size].button,
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "flex items-center justify-center",
          sizeClasses[size].icon,
        )}
      >
        <Icon className="h-full w-full" fill="currentColor" />
      </div>
      <span className={cn("font-light", sizeClasses[size].text)}>{name}</span>
    </Button>
  );
};

export default BranchBadge;
