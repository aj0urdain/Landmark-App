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
  isExpanded?: boolean;
  onExpand?: () => void;
  subsections?: {
    name: string;
    href: string;
    icon: React.ElementType;
    comingSoon?: boolean;
    routeId?: string;
    userId?: string;
  }[];
  isSubsection?: boolean;
}

export const NavLink = React.memo(function NavLink({
  href,
  icon: Icon,
  children,
  isCollapsed,
  comingSoon = false,
  subsections,
  isExpanded = false,
  onExpand,
  isSubsection = false,
}: NavLinkProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: userProfile } = useQuery(userProfileOptions);

  const isTechnology = hasDepartmentAccess(userProfile?.departments, ['Technology']);
  const isClickable = !comingSoon || isTechnology;

  const isActive =
    pathname === href ||
    pathname === `${href}/home` ||
    (pathname.startsWith(`${href}/`) && !pathname.endsWith('/home'));

  const shouldRenderSubsection = (sub: { href: string }) => {
    return !sub.href.endsWith('/home');
  };

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
                onExpand?.();
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
    'flex items-center py-2 my-1 text-sm font-medium rounded-md transition-all duration-200 ease-in-out',
    isActive && !subsections
      ? 'bg-primary text-primary-foreground'
      : isSubsectionActive && subsections && !isCollapsed
        ? 'border border-primary text-primary'
        : isSubsectionActive && subsections && isCollapsed
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    isCollapsed ? 'w-10 h-10 justify-center mx-auto' : 'px-4 mx-4',
    comingSoon && 'opacity-50 cursor-not-allowed',
    isClickable && 'opacity-100',
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
                    className="flex w-full items-center justify-center"
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
              className={cn(
                'flex cursor-pointer items-center gap-1 bg-muted text-xs text-muted-foreground select-none z-[100]',
                isSubsection && 'mb-1.5',
              )}
            >
              <Link href="/updates" className="flex items-center gap-1 z-[100]">
                <Cpu className="h-4 w-4 animate-pulse text-blue-500" />
                <p className="animated-underline-1">
                  {isCollapsed ? (
                    <>
                      <span className="font-bold">{String(children)}</span> is under
                      construction by
                    </>
                  ) : (
                    'Under construction by'
                  )}
                  <span className="font-bold text-blue-500"> @Aaron!</span>
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
      {!isCollapsed && subsections && (
        <div
          className={cn(
            'ml-3 space-y-1 z-[100] overflow-hidden transition-all duration-200 ease-in-out',
            isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 p-0 m-0',
          )}
          style={{
            visibility: isExpanded ? 'visible' : 'hidden',
            marginBottom: isExpanded ? '0.25rem' : '0',
          }}
        >
          {subsections.filter(shouldRenderSubsection).map((subsection) => (
            <NavLink
              key={subsection.href}
              href={subsection.href}
              icon={subsection.icon}
              isCollapsed={isCollapsed}
              comingSoon={subsection.comingSoon}
              routeId={subsection.routeId}
              userId={subsection.userId}
              isExpanded={isExpanded}
              onExpand={onExpand}
              isSubsection={true}
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
            className="bg-background border-muted border z-[100]"
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
