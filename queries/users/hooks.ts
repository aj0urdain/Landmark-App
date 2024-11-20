import { useQuery, useQueries } from '@tanstack/react-query';
import { usersApi } from './api';

export const userKeys = {
  all: ['users'] as const,
  byId: (id: string) => [...userKeys.all, 'user', id] as const,
  byIds: (ids: string[]) => [...userKeys.all, 'users', ids] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: () => usersApi.getAll(),
  });
}

export function useUser(userId: string) {
  const { data: users } = useUsers();

  return useQuery({
    queryKey: userKeys.byId(userId),
    queryFn: async () => {
      // First try to get from cached users
      const cachedUser = users?.find((user) => user.id === userId);
      if (cachedUser) return cachedUser;

      // If not in cache, fetch individually
      return await usersApi.getById(userId);
    },
    enabled: !!userId,
  });
}

export function useMultipleUsers(userIds: string[]) {
  const { data: users } = useUsers();

  return useQueries({
    queries: userIds.map((id) => ({
      queryKey: userKeys.byId(id),
      queryFn: async () => {
        // First try to get from cached users
        const cachedUser = users?.find((user) => user.id === id);
        if (cachedUser) return cachedUser;

        // If not in cache, fetch individually
        return await usersApi.getById(id);
      },
      enabled: !!id,
    })),
  });
}
