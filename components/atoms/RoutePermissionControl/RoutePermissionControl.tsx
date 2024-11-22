'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useRoutePermissions } from '@/queries/access/hooks';
import { useQuery } from '@tanstack/react-query';
import { userProfileOptions } from '@/types/userProfileTypes';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/queries/users/hooks';
import { hasDepartmentAccess } from '@/utils/permissions';

// Add bypass routes that don't need permission checks
const BYPASS_ROUTES = ['/access-denied', '/not-found'];

export function RoutePermissionControl({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: routePermissions, isLoading: routeLoading } = useRoutePermissions();
  const { data: userProfile, isLoading: profileLoading } = useQuery(userProfileOptions);
  const { data: user, isLoading: userLoading } = useUser(userProfile?.id ?? '');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    // Bypass permission check for special routes
    if (BYPASS_ROUTES.includes(pathname)) {
      setHasPermission(true);
      return;
    }

    if (
      !routeLoading &&
      !profileLoading &&
      !userLoading &&
      routePermissions &&
      userProfile &&
      user
    ) {
      const currentRoute = routePermissions.find(
        (route) => route.path === pathname || pathname.startsWith(`${route.path}/`),
      );

      if (!currentRoute) {
        setHasPermission(false);
        return;
      }

      // Check if user is in Technology department
      const isTechnology = hasDepartmentAccess(userProfile.departments, ['Technology']);

      const hasAccess =
        currentRoute.visible && (!currentRoute.developing || isTechnology);

      setHasPermission(hasAccess);

      if (!hasAccess) {
        router.replace('/access-denied');
      }
    }
  }, [
    routePermissions,
    userProfile,
    user,
    routeLoading,
    profileLoading,
    userLoading,
    pathname,
    router,
  ]);

  if (routeLoading || profileLoading || userLoading || hasPermission === null) {
    return <></>;
  }

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}
