import React from 'react';
import Link from 'next/link';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/atoms/Logo/Logo';
import { LogoWordmark } from '@/components/atoms/LogoWordmark/LogoWordmark';
import { Navigation } from '@/components/molecules/Navigation/Navigation';
// import { UpgradeCard } from '@/components/molecules/UpgradeCard/UpgradeCard';

interface SidebarProps {
  isCollapsed: boolean;
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  return (
    <div className='flex flex-col h-full transition-all duration-300 border'>
      <div
        className={`h-16 p-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}
      >
        <Link href='/'>
          {isCollapsed ? (
            <Logo className='h-auto w-5' />
          ) : (
            <LogoWordmark className='h-auto w-32 ml-4' />
          )}
        </Link>
      </div>
      <ScrollArea className='flex-1'>
        <Navigation isCollapsed={isCollapsed} />
      </ScrollArea>
      {/* {!isCollapsed && (
        <div className='p-4'>
          <UpgradeCard />
        </div>
      )} */}
    </div>
  );
}
