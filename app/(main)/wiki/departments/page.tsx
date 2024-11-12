'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createBrowserClient } from '@/utils/supabase/client';
import { getDepartmentInfo } from '@/utils/getDepartmentInfo';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/dist/client/components/navigation';

interface Department {
  id: number;
  department_name: string;
  icon?: React.ReactNode;
  description?: string;
}

export default function DepartmentsPage() {
  const supabase = createBrowserClient();

  const router = useRouter();

  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('department_name');

      if (error) {
        console.error(error);
        return [];
      }

      // Enrich departments with icons and descriptions from getDepartmentInfo
      return data.map((dept) => {
        const deptInfo = getDepartmentInfo(dept.department_name);
        const Icon = deptInfo?.icon;

        return {
          ...dept,
          icon: Icon ? <Icon className="h-6 w-6" /> : null,
          description: deptInfo?.description || 'Department description not available',
        };
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments?.map((department) => (
          <Card
            key={department.id}
            className="transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            onClick={() => {
              router.push(
                `/wiki/departments/${String(department.department_name).toLowerCase()}`,
              );
            }}
          >
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">{department.icon}</div>
                <CardTitle>{department.department_name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{department.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
