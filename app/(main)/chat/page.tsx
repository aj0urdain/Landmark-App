'use client';

import LiveChat from '@/components/molecules/LiveChat/LiveChat';
import ChannelButton from '@/components/molecules/ChannelButton/ChannelButton';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';

const ChatPage = () => {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const supabase = createBrowserClient();

  // Fetch all departments
  const { data: departments, isLoading: isLoadingDepts } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, department_name')
        .order('department_name');

      if (error) throw error;
      return data;
    },
  });

  // Fetch user's authorized departments
  const { data: userDepartments, isLoading: isLoadingUserDepts } = useQuery({
    queryKey: ['userDepartments'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_departments')
        .select('department_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map((d) => d.department_id);
    },
  });

  const handleDepartmentSelect = (id: number) => {
    // Only allow selection if user has access
    if (userDepartments?.includes(id)) {
      setSelectedDepartmentId(id);
    }
  };

  if (isLoadingDepts || isLoadingUserDepts) {
    return <div>Loading...</div>;
  }

  // Separate departments into authorized and unauthorized
  const authorizedDepts =
    departments?.filter((dept) => userDepartments?.includes(dept.id)) || [];

  const unauthorizedDepts =
    departments?.filter((dept) => !userDepartments?.includes(dept.id)) || [];

  return (
    <div className="w-full h-full flex gap-4">
      <Card className="w-2/5 h-full flex flex-col gap-4 p-4">
        {/* Authorized Departments */}
        {authorizedDepts.map((department) => (
          <ChannelButton
            key={department.id}
            departmentId={department.id}
            isSelected={selectedDepartmentId === department.id}
            onClick={() => handleDepartmentSelect(department.id)}
          />
        ))}

        {/* Only show separator if there are both authorized and unauthorized departments */}
        {authorizedDepts.length > 0 && unauthorizedDepts.length > 0 && (
          <Separator className="my-2" />
        )}

        {/* Unauthorized Departments */}
        {unauthorizedDepts.map((department) => (
          <ChannelButton
            key={department.id}
            departmentId={department.id}
            isSelected={false}
            disabled={true}
            onClick={() => {}} // Empty function since button is disabled
          />
        ))}
      </Card>
      <Card className="w-3/5 h-full">
        {selectedDepartmentId && (
          <LiveChat
            chatName={
              departments?.find((d) => d.id === selectedDepartmentId)?.department_name ??
              ''
            }
          />
        )}
      </Card>
    </div>
  );
};

export default ChatPage;
