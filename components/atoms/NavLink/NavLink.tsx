'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChevronDown, Cpu, Hammer } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { userProfileOptions } from '@/types/userProfileTypes';
import { hasDepartmentAccess } from '@/utils/permissions';

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isCollapsed: boolean;
  comingSoon?: boolean;
  subsections?: {
    name: string;
    href: string;
    icon: React.ElementType;
    comingSoon?: boolean;
    requiredAccess?: string[];
  }[];
  requiredAccess?: string[];
}

export const NavLink = React.memo(function NavLink({
  href,
  icon: Icon,
  children,
  isCollapsed,
  comingSoon = false,
  subsections,
  requiredAccess = [],
}: NavLinkProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: userProfile } = useQuery(userProfileOptions);

  const hasAccess = hasDepartmentAccess(userProfile?.departments, requiredAccess);
  const isDisabled = comingSoon && !hasAccess;

  const isActive =
    pathname === href ||
    (pathname.startsWith(`${href}/`) && href !== '/wiki' && href !== '/');
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
                e.stopPropagation(); // Add this line
                setIsExpanded(!isExpanded);
              }}
              className="relative z-10 ml-auto" // Add relative and z-10
            >
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isExpanded ? 'rotate-180' : 'rotate-0',
                )}
              />
            </button>
          )}
        </span>
      )}
    </>
  );

  const linkClass = cn(
    'flex items-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out',
    isActive && !subsections
      ? 'bg-primary text-primary-foreground'
      : isSubsectionActive && subsections && !isCollapsed
        ? 'border border-primary text-primary'
        : isSubsectionActive && subsections && isCollapsed
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    isCollapsed ? 'w-10 h-10 justify-center mx-auto' : 'px-4 mx-4',
    isDisabled && 'opacity-50 cursor-not-allowed',
    isLoading && 'animate-pulse [animation-duration:2s]',
  );

  const linkElement = (
    <>
      {isDisabled ? (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`${linkClass} group transition-all duration-200 ease-in-out`}
              >
                {linkContent}
                {!isCollapsed && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {/* <Construction className="h-4 w-4" /> */}

                    <Hammer className="h-4 w-4 group-hover:animate-spin" />
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              align="center"
              sideOffset={10}
              className="flex cursor-pointer items-center gap-1 bg-muted text-xs text-blue-500 select-none z-[100]"
            >
              <Link href="/updates" className="flex items-center gap-1">
                <Cpu className="h-4 w-4 animate-pulse" />
                <p className="animated-underline-1">
                  {isCollapsed
                    ? `${String(children)} is under construction by`
                    : 'Under construction by'}{' '}
                  <span className="font-bold"> @Aaron!</span>
                </p>
              </Link>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Link
          href={href}
          className={linkClass}
          onClick={(e) => {
            if (!isActive) {
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
          key={String(isExpanded)}
          className="ml-3 mt-1 animate-slide-down-fade-in space-y-1"
        >
          {subsections.map((subsection) => (
            <NavLink
              key={subsection.href}
              href={subsection.href}
              icon={subsection.icon}
              isCollapsed={isCollapsed}
              comingSoon={subsection.comingSoon}
              requiredAccess={subsection.requiredAccess}
            >
              <span className="text-xs">{subsection.name}</span>
            </NavLink>
          ))}
        </div>
      )}
    </>
  );

  if (isCollapsed && !isDisabled) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>{linkElement}</TooltipTrigger>
          <TooltipContent
            side="right"
            align="center"
            sideOffset={-10}
            className="bg-background border-muted border z-50"
          >
            <p className="flex items-center gap-2 text-foreground font-medium select-none">
              {children}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return linkElement;
});
