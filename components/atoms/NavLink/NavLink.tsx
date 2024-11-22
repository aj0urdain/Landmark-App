'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { userProfileOptions } from '@/types/userProfileTypes';
import { hasDepartmentAccess } from '@/utils/permissions';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChevronDown, Cpu, Hammer } from 'lucide-react';

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isCollapsed: boolean;
  comingSoon?: boolean;
  routeId?: string;
  userId?: string;
  subsections?: {
    name: string;
    href: string;
    icon: React.ElementType;
    comingSoon?: boolean;
    routeId?: string;
    userId?: string;
  }[];
}

export const NavLink = React.memo(function NavLink({
  href,
  icon: Icon,
  children,
  isCollapsed,
  comingSoon = false,
  subsections,
}: NavLinkProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: userProfile } = useQuery(userProfileOptions);

  const isTechnology = hasDepartmentAccess(userProfile?.departments, ['Technology']);
  const isClickable = !comingSoon || isTechnology;

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
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="relative z-10 ml-auto"
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
    comingSoon && 'opacity-50 cursor-not-allowed',
    isLoading && 'animate-pulse [animation-duration:2s]',
  );

  const linkElement = (
    <>
      {comingSoon ? (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(linkClass, 'group transition-all duration-200 ease-in-out')}
              >
                {isClickable ? (
                  <Link
                    href={href}
                    className="flex w-full items-center"
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
                ) : (
                  linkContent
                )}
                {!isCollapsed && (
                  <div className="flex items-center gap-2 text-muted-foreground">
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
                    : 'Under construction by'}
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
        <div className="ml-3 mt-1 animate-slide-down-fade-in space-y-1">
          {subsections.map((subsection) => (
            <NavLink
              key={subsection.href}
              href={subsection.href}
              icon={subsection.icon}
              isCollapsed={isCollapsed}
              comingSoon={subsection.comingSoon}
              routeId={subsection.routeId}
              userId={subsection.userId}
            >
              <span className="text-xs">{subsection.name}</span>
            </NavLink>
          ))}
        </div>
      )}
    </>
  );

  if (isCollapsed && !comingSoon) {
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
