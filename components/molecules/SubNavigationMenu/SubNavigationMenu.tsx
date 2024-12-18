'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { LogoWordmark } from '@/components/atoms/LogoWordmark/LogoWordmark';
import { Dot } from '@/components/atoms/Dot/Dot';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/atoms/Logo/Logo';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAccessibleRoutes } from '@/hooks/useAccessibleRoutes';
import { getIconFromString } from '@/utils/icons/icons';
import { DevelopingTooltip } from '@/components/atoms/DevelopingTooltip/DevelopingTooltip';

const SubNavigationMenu: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { accessibleRoutes, isLoading, getSubRoutes } = useAccessibleRoutes();

  useEffect(() => {
    setLoadingStates({});
  }, [pathname]);

  // Get the first segment of the path
  const segments = pathname.split('/').filter(Boolean);
  const title =
    segments[0]?.charAt(0).toUpperCase() + segments[0]?.slice(1).toLowerCase();

  if (isLoading) return null;

  // Find parent route to get its ID
  const parentRoute = accessibleRoutes.find(
    (route) => route.path === `/${title.toLowerCase()}`,
  );

  if (!parentRoute) return null;

  // Get sub-routes for this section
  const links = getSubRoutes?.(parentRoute.id ?? '').map((route) => ({
    label: route.label,
    icon: getIconFromString(route.icon ?? ''),
    path: route.path,
    developing: route.developing ?? false,
  }));

  const handleClick = (href: string, disabled?: boolean) => {
    if (disabled) return;
    if (pathname !== href) {
      setLoadingStates((prev) => ({ ...prev, [href]: true }));
      router.push(href);
    }
  };

  if (!links) return null;

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
              <TooltipProvider key={link.label} delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        handleClick(link.path ?? '', link.developing);
                      }}
                      variant="ghost"
                      className={cn(
                        'flex items-center p-0 px-0 transition-all sm:px-1 xl:gap-1 xl:px-2',
                        pathname === link.path ||
                          (pathname.startsWith(`${String(link.path)}/`) &&
                            link.path !== '/')
                          ? 'border-b-2 border-foreground text-foreground hover:bg-transparent'
                          : 'text-muted-foreground hover:border-b-2 hover:border-foreground hover:bg-transparent hover:text-foreground',
                        loadingStates[link.path ?? ''] &&
                          'animate-pulse [animation-duration:2s]',
                        link.developing && 'cursor-not-allowed opacity-50',
                      )}
                    >
                      <link.icon className="h-4 w-4 xl:h-3 xl:w-3" />
                      <span className="hidden xl:block">{link.label}</span>
                    </Button>
                  </TooltipTrigger>
                  {link.developing && <DevelopingTooltip label={link.label ?? ''} />}
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
