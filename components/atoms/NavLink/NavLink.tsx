"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown } from "lucide-react";

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isCollapsed: boolean;
  disabled?: boolean;
  subsections?: { name: string; href: string; icon: React.ElementType }[];
}

export const NavLink = React.memo(function NavLink({
  href,
  icon: Icon,
  children,
  isCollapsed,
  disabled = false,
  subsections,
}: NavLinkProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (pathname.startsWith(`${href}/`) && href !== "/wiki" && href !== "/");
  const isSubsectionActive = subsections?.some(
    (sub) => pathname === sub.href || pathname.startsWith(`${sub.href}/`),
  );

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const linkContent = (
    <>
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && (
        <span className="ml-3 flex flex-1 items-center justify-between">
          {children}
          {subsections && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsExpanded(!isExpanded);
              }}
              className="ml-auto"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isExpanded ? "rotate-180" : "rotate-0",
                )}
              />
            </button>
          )}
        </span>
      )}
    </>
  );

  const linkClass = cn(
    "flex items-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out",
    isActive && !subsections
      ? "bg-primary text-primary-foreground"
      : isSubsectionActive && subsections && !isCollapsed
        ? "border border-primary text-primary"
        : isSubsectionActive && subsections && isCollapsed
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
    isCollapsed ? "w-10 h-10 justify-center mx-auto" : "px-4 mx-4",
    disabled && "opacity-50 cursor-not-allowed",
    isLoading && "animate-pulse [animation-duration:2s]",
  );

  const linkElement = (
    <>
      {disabled ? (
        <div className={linkClass}>{linkContent}</div>
      ) : (
        <Link
          href={href}
          className={linkClass}
          onClick={(e) => {
            if (!disabled && !isActive) {
              e.preventDefault();
              setIsLoading(true);
              router.push(href);
            }
          }}
        >
          {linkContent}
        </Link>
      )}
      {!isCollapsed && subsections && isExpanded && (
        <div
          key={`${isExpanded}`}
          className="ml-3 mt-1 animate-slide-down-fade-in space-y-1"
        >
          {subsections.map((subsection) => (
            <NavLink
              key={subsection.href}
              href={subsection.href}
              icon={subsection.icon}
              isCollapsed={isCollapsed}
            >
              <span className="text-xs">{subsection.name}</span>
            </NavLink>
          ))}
        </div>
      )}
    </>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
          <TooltipContent side="right" align="center" sideOffset={10}>
            {children}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return linkElement;
});
