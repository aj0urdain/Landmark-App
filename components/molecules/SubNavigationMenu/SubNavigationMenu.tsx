'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { LogoWordmark } from '@/components/atoms/LogoWordmark/LogoWordmark';
import { Dot } from '@/components/atoms/Dot/Dot';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Cpu, LucideIcon } from 'lucide-react';
import { Logo } from '@/components/atoms/Logo/Logo';
import { Hammer } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';

interface NavLink {
  name: string;
  icon: LucideIcon;
  href: string;
  disabled?: boolean;
}

interface SubNavigationMenuProps {
  title: string;
  links: NavLink[];
  rootPath: string;
}

const SubNavigationMenu: React.FC<SubNavigationMenuProps> = ({
  title,
  links,
  rootPath,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLoadingStates({});
  }, [pathname]);

  const handleClick = (href: string, disabled?: boolean) => {
    if (disabled) return;
    if (pathname !== href) {
      setLoadingStates((prev) => ({ ...prev, [href]: true }));
      router.push(href);
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-gradient-to-b from-transparent via-background/50 to-background backdrop-blur-3xl rounded-b-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4">
          <div className="flex items-center justify-center gap-4">
            <Logo className="hidden h-8 w-auto sm:block 2xl:hidden" />
            <LogoWordmark className="hidden h-7 w-auto 2xl:block" />
            <Dot size="small" className="hidden animate-pulse bg-foreground sm:block" />
            <h1 className="font-lexia font-bold uppercase tracking-wider">{title}</h1>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 xl:gap-8">
            {links.map((link) => (
              <TooltipProvider key={link.name} delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        handleClick(link.href, link.disabled);
                      }}
                      variant="ghost"
                      className={cn(
                        'flex items-center p-0 px-0 transition-all sm:px-1 xl:gap-1 xl:px-2',
                        pathname === link.href ||
                          (pathname.startsWith(`${link.href}/`) && link.href !== rootPath)
                          ? 'border-b-2 border-foreground text-foreground hover:bg-transparent'
                          : 'text-muted-foreground hover:border-b-2 hover:border-foreground hover:bg-transparent hover:text-foreground',
                        loadingStates[link.href] &&
                          'animate-pulse [animation-duration:2s]',
                        link.disabled && 'cursor-not-allowed opacity-50',
                      )}
                    >
                      <link.icon className="h-4 w-4 xl:h-3 xl:w-3" />
                      <span className="hidden xl:block">{link.name}</span>
                    </Button>
                  </TooltipTrigger>
                  {link.disabled && (
                    <TooltipContent
                      side="top"
                      align="center"
                      sideOffset={10}
                      className="flex cursor-pointer items-center gap-1 bg-muted text-xs text-blue-500 select-none z-[100]"
                    >
                      <Link href="/updates" className="flex items-center gap-1">
                        <Cpu className="h-4 w-4 animate-pulse" />
                        <p className="animated-underline-1">
                          {link.name} is under construction by
                          <span className="font-bold"> @Aaron!</span>
                        </p>
                      </Link>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
    </div>
  );
};

export default SubNavigationMenu;
