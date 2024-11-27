import { useQuery } from '@tanstack/react-query';
import { accessApi, authApi } from './api';

export const accessKeys = {
  all: ['access'] as const,
  routes: () => [...accessKeys.all, 'routes'] as const,
  routeAccess: () => [...accessKeys.all, 'routeAccess'] as const,
};

export const authKeys = {
  all: ['auth'] as const,
  allowedDomains: () => [...authKeys.all, 'allowedDomains'] as const,
};

export function useRoutePermissions() {
  return useQuery({
    queryKey: accessKeys.routes(),
    queryFn: () => accessApi.getRoutePermissions(),
  });
}

export function useAllowedDomains() {
  return useQuery({
    queryKey: authKeys.allowedDomains(),
    queryFn: () => authApi.getAllowedDomains(),
  });
}
