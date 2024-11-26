'use client';

import { useRoutePermissions } from '@/queries/access/hooks';
import { useQuery } from '@tanstack/react-query';
import { userProfileOptions } from '@/types/userProfileTypes';
import { usePathname } from 'next/navigation';

export function useRoutePermission() {
  const pathname = usePathname();
  const { data: routePermissions, isLoading: routeLoading } = useRoutePermissions();
  const { data: userProfile, isLoading: profileLoading } = useQuery(userProfileOptions);

  if (routeLoading || profileLoading || !routePermissions || !userProfile) {
    return { isLoading: true, hasPermission: false };
  }

  const currentRoute = routePermissions.find(
    (route) => route.path === pathname || pathname.startsWith(`${String(route.path)}/`),
  );

  if (!currentRoute) {
    return { isLoading: false, hasPermission: false };
  }

  // Check if route is under development first
  if (currentRoute.developing) {
    return {
      isLoading: false,
      hasPermission: userProfile.departments?.includes('Technology') ?? false,
    };
  }

  // Then check if route is public
  if (currentRoute.public) {
    return { isLoading: false, hasPermission: true };
  }

  // If route is not public, it must have at least one access control set
  const hasAccessControls =
    (currentRoute.department_ids?.length ?? 0) > 0 ||
    (currentRoute.team_ids?.length ?? 0) > 0 ||
    (currentRoute.role_ids?.length ?? 0) > 0 ||
    (currentRoute.user_ids?.length ?? 0) > 0;

  // If no access controls are set, deny access
  if (!hasAccessControls) {
    return { isLoading: false, hasPermission: false };
  }

  // Check access through department, team, role, or direct user assignment
  const hasAccess =
    (currentRoute.department_ids?.some((deptId) =>
      userProfile.department_ids?.includes(deptId),
    ) ??
      false) ||
    (currentRoute.team_ids?.some((teamId) => userProfile.team_ids?.includes(teamId)) ??
      false) ||
    (currentRoute.role_ids?.some((roleId) => userProfile.role_ids?.includes(roleId)) ??
      false) ||
    (currentRoute.user_ids?.includes(userProfile.id) ?? false);

  return { isLoading: false, hasPermission: hasAccess };
}
