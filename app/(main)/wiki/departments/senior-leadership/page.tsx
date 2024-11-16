'use client';

import React from 'react';
import { createBrowserClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';
import GenericDepartmentNewsCard from '@/components/molecules/GenericDepartmentNewsCard/GenericDepartmentNewsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserCard from '@/components/molecules/UserCard/UserCard';

const SeniorLeadershipDepartmentPage = () => {
  const supabase = createBrowserClient();

  // Get department ID for Senior Leadership
  const { data: department } = useQuery({
    queryKey: ['department', 'Senior Leadership'],
    queryFn: async () => {
      const { data } = await supabase
        .from('departments')
        .select('*')
        .eq('department_name', 'Senior Leadership')
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="people" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="news">News & Announcements</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            {department?.id && <GenericDepartmentNewsCard departmentID={department.id} />}
          </div>
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

export default SeniorLeadershipDepartmentPage;
