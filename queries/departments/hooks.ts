import { useQuery } from '@tanstack/react-query';
import { departmentsApi } from './api';
import { departmentInfo } from '@/utils/getDepartmentInfo';
import { EnrichedDepartment } from './types';

export const departmentKeys = {
  all: ['departments'] as const,
  byUser: (userId: string) => [...departmentKeys.all, 'user', userId] as const,
};

export function useDepartments() {
  return useQuery({
    queryKey: departmentKeys.all,
    queryFn: async () => {
      const departments = await departmentsApi.getAll();

      const enrichedDepartments = departments.map(
        (dept): EnrichedDepartment => ({
          ...dept,
          ...(departmentInfo.find((info) => info.name === dept.department_name) ?? {
            color: 'gray',
            backgroundColor: 'bg-gray-100',
          }),
        }),
      );

      console.log(enrichedDepartments);

      return enrichedDepartments;
    },
  });
}

export function useUserDepartments(userId: string) {
  return useQuery({
    queryKey: departmentKeys.byUser(userId),
    queryFn: () => departmentsApi.getByUserId(userId),
  });
}
