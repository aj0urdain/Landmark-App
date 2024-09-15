'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import React from 'react';

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isCollapsed: boolean;
}

export const NavLink = React.memo(function NavLink({
  href,
  icon: Icon,
  children,
  isCollapsed,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const link = (
    <Link
      href={href}
      className={cn(
        'flex items-center py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        isCollapsed ? 'w-10 h-10 justify-center mx-auto' : 'px-4 mx-4'
      )}
    >
      <Icon className='h-5 w-5 shrink-0' />
      {!isCollapsed && <span className='ml-3'>{children}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <div className='flex justify-center items-center'>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>{link}</TooltipTrigger>
            <TooltipContent side='right' align='center' sideOffset={10}>
              {children}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return link;
});
