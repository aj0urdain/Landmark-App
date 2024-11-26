'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useRoutePermissions } from '@/queries/access/hooks';
import { useQuery } from '@tanstack/react-query';
import { userProfileOptions } from '@/types/userProfileTypes';
import React, { useEffect, useState } from 'react';

export function RoutePermissionControl({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: routePermissions, isLoading: routeLoading } = useRoutePermissions();
  const { data: userProfile, isLoading: profileLoading } = useQuery(userProfileOptions);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (!routeLoading && !profileLoading && routePermissions && userProfile) {
      const currentRoute = routePermissions.find(
        (route) =>
          route.path === pathname || pathname.startsWith(`${String(route.path)}/`),
      );

      if (!currentRoute) {
        setHasPermission(false);
        router.replace('/access-denied');
        return;
      }

      // Check if route is under development first
      if (currentRoute.developing) {
        const hasTechnologyAccess =
          userProfile.departments?.includes('Technology') ?? false;
        setHasPermission(hasTechnologyAccess);
        if (!hasTechnologyAccess) {
          router.replace('/access-denied');
        }
        return;
      }

      // Then check if route is public
      if (currentRoute.public) {
        setHasPermission(true);
        return;
      }

      // If route is not public, it must have at least one access control set
      const hasAccessControls =
        (currentRoute.department_ids?.length ?? 0) > 0 ||
        (currentRoute.team_ids?.length ?? 0) > 0 ||
        (currentRoute.role_ids?.length ?? 0) > 0 ||
        (currentRoute.user_ids?.length ?? 0) > 0;

      // If no access controls are set, deny access
      if (!hasAccessControls) {
        setHasPermission(false);
        router.replace('/access-denied');
        return;
      }

      // Check access through department, team, role, or direct user assignment
      const hasAccess =
        (currentRoute.department_ids?.some((deptId) =>
          userProfile.department_ids?.includes(deptId),
        ) ??
          false) ||
        (currentRoute.team_ids?.some((teamId) =>
          userProfile.team_ids?.includes(teamId),
        ) ??
          false) ||
        (currentRoute.role_ids?.some((roleId) =>
          userProfile.role_ids?.includes(roleId),
        ) ??
          false) ||
        (currentRoute.user_ids?.includes(userProfile.id) ?? false);

      setHasPermission(hasAccess);
      if (!hasAccess) router.replace('/access-denied');
    }
  }, [routePermissions, userProfile, routeLoading, profileLoading, pathname, router]);

  if (routeLoading || profileLoading || hasPermission === null) {
    return null;
  }

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}
