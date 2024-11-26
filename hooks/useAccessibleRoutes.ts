import { useRoutePermissions } from '@/queries/access/hooks';
import { useQuery } from '@tanstack/react-query';
import { userProfileOptions } from '@/types/userProfileTypes';

interface Route {
  path: string;
  department_ids?: string[];
  team_ids?: string[];
  role_ids?: string[];
  user_ids?: string[];
  parent_path?: string;
  public?: boolean;
  developing?: boolean;
  main_navigation?: boolean;
  sort_order?: number;
  id: string;
}

export function useAccessibleRoutes() {
  const { data: routePermissions, isLoading } = useRoutePermissions();
  const { data: userProfile } = useQuery(userProfileOptions);

  if (isLoading || !routePermissions || !userProfile) {
    return { accessibleRoutes: [], isLoading: true };
  }

  // Helper function to check if a route has any access controls
  const hasAnyAccessControls = (route: Route) => {
    const hasControls =
      (route.department_ids?.length ?? 0) > 0 ||
      (route.team_ids?.length ?? 0) > 0 ||
      (route.role_ids?.length ?? 0) > 0 ||
      (route.user_ids?.length ?? 0) > 0;

    return hasControls;
  };

  // Helper function to check if user has access to a route
  const hasAccessToRoute = (route: Route) => {
    // If route is public, grant access
    if (route.public) {
      return true;
    }

    // If no access controls, check parent access
    if (!hasAnyAccessControls(route)) {
      const parentRoute = routePermissions.find((r) => r.id === route.parent_path);
      if (parentRoute) {
        return hasAccessToRoute(parentRoute);
      }
      return true;
    }

    // Check direct access
    const hasAccess =
      (route.department_ids?.some((deptId: string) =>
        userProfile.department_ids?.includes(parseInt(deptId)),
      ) ??
        false) ||
      (route.team_ids?.some((teamId: string) =>
        userProfile.team_ids?.includes(parseInt(teamId)),
      ) ??
        false) ||
      (route.role_ids?.some((roleId: string) =>
        userProfile.role_ids?.includes(parseInt(roleId)),
      ) ??
        false) ||
      (route.user_ids?.includes(userProfile.id) ?? false);

    return hasAccess;
  };

  // First, get all routes that should be rendered
  const renderableRoutes = routePermissions.filter((route) => {
    return hasAccessToRoute(route);
  });

  // Then, determine clickability for each route
  const accessibleRoutes = renderableRoutes.map((route) => ({
    ...route,
    isClickable: route.developing
      ? userProfile.departments?.includes('Technology')
      : true,
  }));

  return {
    accessibleRoutes,
    isLoading: false,
    getSubRoutes: (parentId: string) => {
      return accessibleRoutes
        .filter((r) => r.parent_path === parentId)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    },
    getMainRoutes: () => {
      return accessibleRoutes
        .filter((route) => !route.parent_path && route.main_navigation)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    },
  };
}
