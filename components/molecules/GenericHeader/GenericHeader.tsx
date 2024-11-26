'use client';

import { useRoutePermissions } from '@/queries/access/hooks';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';
import { getIconFromString } from '@/utils/icons/icons';

export function GenericHeader() {
  const { data: routePermissions } = useRoutePermissions();
  const pathname = usePathname();

  if (!routePermissions) return null;

  const title = pathname
    .toString()
    .split('/')
    .filter((segment) => segment !== 'wiki')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const currentRoute = routePermissions.find((route) => route.path === pathname);
  const Icon = currentRoute?.icon ? getIconFromString(currentRoute.icon) : null;

  return (
    <div className="relative flex min-h-48 items-end justify-start overflow-hidden rounded-b-3xl">
      <Image
        src={`/images/auctionImages/crown-casino-melbourne.jpg`}
        alt={`Auction`}
        width={1000}
        height={1000}
        className="absolute left-0 top-0 h-full w-full object-cover object-bottom opacity-40"
      />
      <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-background via-background/90 to-background/50"></div>
      <div className="z-10 flex items-center p-6">
        <div>
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="flex items-center gap-2" key={title}>
              {Icon &&
                React.createElement(Icon, {
                  className: 'h-6 w-6 animate-slide-left-fade-in',
                })}
              <h1 className="text-4xl font-black animate-slide-right-fade-in">{title}</h1>
            </div>
            <div>
              {/* <p className="text-muted-foreground">{currentRoute?.description}</p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
