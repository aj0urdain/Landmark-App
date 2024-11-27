import React from 'react';

import LiveChat from '@/components/molecules/LiveChat/LiveChat';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';

import GenericDepartmentNewsCard from '@/components/molecules/GenericDepartmentNewsCard/GenericDepartmentNewsCard';
import GenericDepartmentStaffEventsCard from '@/components/molecules/GenericDepartmentStaffEventsCard/GenericDepartmentStaffEventsCard';

export function GenericDepartmentRow({ department }: { department: string }) {
  const { data: departmentData } = useQuery({
    queryKey: ['department', department],
    queryFn: async () => {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('departments')
        .select('id, department_name')
        .eq('department_name', department)
        .single();

      if (error) {
        console.error('Error fetching department:', error);
        return null;
      }

      console.log('Department data:', data);

      return data;
    },
  });

  if (!departmentData) return null;

  return (
    <>
      <div className="col-span-6 flex h-full max-h-[420px] flex-col gap-4">
        <GenericDepartmentNewsCard departmentID={departmentData.id} />

        <GenericDepartmentStaffEventsCard
          departmentID={departmentData.id}
          departmentName={departmentData.department_name}
        />
      </div>
      <div className="col-span-6 h-full overflow-visible">
        <LiveChat
          chatName={departmentData.department_name}
          height={420}
          key={departmentData.department_name}
        />

        {/* Generic Department Announcements */}
      </div>
    </>
  );
}
