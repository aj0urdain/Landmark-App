'use client';

import React from 'react';
import { createBrowserClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserCard from '@/components/molecules/UserCard/UserCard';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FileText, Newspaper, Users } from 'lucide-react';
import DepartmentNewsTabContent from '@/components/molecules/DepartmentNewsTabContent/DepartmentNewsTabContent';

const DepartmentPage = () => {
  const supabase = createBrowserClient();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'people';
  const departmentSlug = params.department as string;

  // Convert slug to department name (e.g., "senior-leadership" to "Senior Leadership")
  const departmentName = departmentSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Get department ID for the current department
  const { data: department } = useQuery({
    queryKey: ['department', departmentName],
    queryFn: async () => {
      const { data } = await supabase
        .from('departments')
        .select('*')
        .eq('department_name', departmentName)
        .single();
      return data;
    },
  });

  // Get users in this department
  const { data: users } = useQuery({
    queryKey: ['departmentUsers', department?.id],
    enabled: !!department?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from('user_profile_complete')
        .select('id')
        .contains('department_ids', [department?.id ?? ''])
        .order('work_anniversary', { ascending: true });
      return data;
    },
  });

  const handleTabChange = (value: string) => {
    router.push(`/wiki/departments/${departmentSlug}?tab=${value}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4 bg-transparent flex gap-4 w-fit">
          <TabsTrigger value="people" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <p className="animated-underline-1">People</p>
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            <p className="animated-underline-1">News & Announcements</p>
          </TabsTrigger>
          <TabsTrigger value="resources" disabled className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <p className="animated-underline-1">Resources</p>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="people" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users?.map((user, index) => (
              <StaggeredAnimation key={user.id} index={index}>
                <UserCard userId={user.id ?? ''} />
              </StaggeredAnimation>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="news">
          {department?.id && (
            <DepartmentNewsTabContent departmentId={String(department.id)} />
          )}
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Add your resource links here */}
                {/* Example: Meeting templates, department policies, etc. */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentPage;
