import { useQuery } from '@tanstack/react-query';
import { accessApi } from './api';

export const accessKeys = {
  all: ['access'] as const,
  routes: () => [...accessKeys.all, 'routes'] as const,
};

export function useRoutePermissions() {
  return useQuery({
    queryKey: accessKeys.routes(),
    queryFn: () => accessApi.getRoutePermissions(),
  });
}
