'use client';

import React from 'react';
import DepartmentLinkCard from '@/components/molecules/DepartmentLinkCard/DepartmentLinkCard';
import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';
import { Skeleton } from '@/components/ui/skeleton';
import { useDepartments } from '@/queries/departments/hooks';

export default function DepartmentsPage() {
  const { data: departments, isLoading } = useDepartments();

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
        {departments?.map((department, index) => {
          if (department.department_name === 'Burgess Rawson') {
            return null;
          }

          return (
            <StaggeredAnimation key={String(department.id)} index={index} baseDelay={0.1}>
              <DepartmentLinkCard
                key={String(department.id)}
                department={department.department_name}
                departmentId={department.id}
                description={department.description ?? ''}
              />
            </StaggeredAnimation>
          );
        })}
      </div>
    </div>
  );
}
