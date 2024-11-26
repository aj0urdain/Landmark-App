'use client';

import { useRoutePermissions } from '@/queries/access/hooks';

export function RoutePermissionControlNEW({ children }: { children: React.ReactNode }) {
  const { data: routePermissions, isLoading: routePermissionsLoading } =
    useRoutePermissions();

  if (routePermissionsLoading) return null;

  console.log(routePermissions);

  return <>{children}</>;
}
