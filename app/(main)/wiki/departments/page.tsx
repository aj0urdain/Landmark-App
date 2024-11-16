'use client';

import React from 'react';
import { createBrowserClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import DepartmentLinkCard from '@/components/molecules/DepartmentLinkCard/DepartmentLinkCard';
import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';
import { Skeleton } from '@/components/ui/skeleton';

export default function DepartmentsPage() {
  const supabase = createBrowserClient();

  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('id')
        .neq('department_name', 'Burgess Rawson');

      if (error) {
        console.error(error);
        return [];
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-slide-down-fade-in">
              <Skeleton className="h-60 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments?.map((department, index) => (
          <StaggeredAnimation key={String(department.id)} index={index} baseDelay={0.1}>
            <DepartmentLinkCard
              key={String(department.id)}
              department={department.department_name}
              departmentId={department.id}
              description={department.description}
            />
          </StaggeredAnimation>
        ))}
      </div>
    </div>
  );
}
