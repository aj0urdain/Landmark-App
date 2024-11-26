'use client';

import LiveChat from '@/components/molecules/LiveChat/LiveChat';
import ChannelButton from '@/components/molecules/ChannelButton/ChannelButton';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { Loader2, MessageCircle } from 'lucide-react';
import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Chat = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract this into a custom hook for better organization
  const useChatRoom = () => {
    const room = searchParams.get('room');

    // Handle initial routing
    React.useEffect(() => {
      if (!room) {
        router.push('/chat?room=burgess-rawson');
      }
    }, [room, router]);

    return {
      selectedDepartmentName: room || 'burgess-rawson',
    };
  };

  const { selectedDepartmentName } = useChatRoom();

  const supabase = createBrowserClient();

  // Fetch all departments
  const { data: chatRooms, isLoading: isLoadingRooms } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: async () => {
      const { data: rooms, error } = await supabase
        .from('chat_rooms')
        .select(
          `
          name, 
          id, 
          parent_room, 
          department_id,
          team_id,
          departments(id, department_name)
        `,
        )
        .order('name');

      if (error) {
        console.error('❌ Error fetching chat rooms:', error);
        throw new Error(error.message);
      }

      // Group rooms by department and parent/child relationship
      const parentRooms = rooms.filter((room) => !room.parent_room);
      const childRooms = rooms.filter((room) => room.parent_room);

      // Add child rooms to their parents
      const structuredRooms = parentRooms.map((parent) => {
        const children = childRooms.filter(
          (child) =>
            child.parent_room === parent.id &&
            child.departments?.id === parent.departments?.id,
        );

        return {
          ...parent,
          subRooms: children,
        };
      });

      // Sort to ensure Burgess Rawson is first
      return structuredRooms.sort((a, b) => {
        if (a.departments?.department_name.toLowerCase() === 'burgess rawson') return -1;
        if (b.departments?.department_name.toLowerCase() === 'burgess rawson') return 1;
        return (
          a.departments?.department_name.localeCompare(b.departments?.department_name) ??
          0
        );
      });
    },
  });

  // Handle redirect after loading states are complete
  React.useEffect(() => {
    if (!isLoadingRooms && !searchParams.get('room')) {
      router.push(`/chat?room=burgess-rawson`);
    }
  }, [isLoadingRooms, searchParams, router]);

  // Fetch user's authorized departments
  const { data: userAccess, isLoading: isLoadingAccess } = useQuery({
    queryKey: ['userAccess'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error('❌ No user found');
        throw new Error('No user found');
      }

      // Get user's departments
      const { data: userDepts, error: deptError } = await supabase
        .from('user_departments')
        .select('department_id')
        .eq('user_id', user.id);

      if (deptError) {
        console.error('❌ Error fetching user departments:', deptError);
      }

      // Get user's teams
      const { data: userTeams, error: teamError } = await supabase
        .from('user_teams')
        .select('team_id')
        .eq('user_id', user.id);

      if (teamError) {
        console.error('❌ Error fetching user teams:', teamError);
      }

      const access = {
        departments: userDepts?.map((d) => d.department_id) ?? [],
        teams: userTeams?.map((t) => t.team_id) ?? [],
      };

      return access;
    },
  });

  const handleDepartmentSelect = (
    departmentId: number,
    chatRoomId: number,
    teamId: number | null,
    name: string,
  ) => {
    // Allow access if user has department access or team access
    if (
      userAccess?.departments.includes(departmentId) ||
      (teamId && userAccess?.teams.includes(teamId))
    ) {
      const urlFriendlyName = name.toLowerCase().replace(/\s+/g, '-');
      router.push(`/chat?room=${urlFriendlyName}`);
    }
  };

  // Add logging to the authorization filtering

  // Separate departments into authorized and unauthorized
  const authorizedDepts =
    chatRooms?.filter((dept) => userAccess?.departments.includes(dept.departments.id)) ??
    [];
  const unauthorizedDepts =
    chatRooms?.filter((dept) => !userAccess?.departments.includes(dept.departments.id)) ??
    [];

  // Add this near your other state/data declarations
  const selectedDepartment = chatRooms?.find(
    (dept) =>
      dept.departments.department_name.toLowerCase().replace(/\s+/g, '-') ===
        selectedDepartmentName ||
      dept.subRooms?.some(
        (subRoom) =>
          subRoom.name.toLowerCase().replace(/\s+/g, '-') === selectedDepartmentName,
      ),
  );

  // Find the selected sub-room if it exists
  const selectedSubRoom = selectedDepartment?.subRooms?.find(
    (subRoom) =>
      subRoom.name.toLowerCase().replace(/\s+/g, '-') === selectedDepartmentName,
  );

  // Update the hasAccess check to handle both department and team access
  const hasAccess = React.useMemo(() => {
    if (!selectedDepartment || !userAccess) return false;

    // If it's a team chat (sub-room)
    if (selectedSubRoom) {
      return userAccess.teams.includes(selectedSubRoom.team_id);
    }

    // If it's a department chat
    return userAccess.departments.includes(selectedDepartment.departments.id);
  }, [selectedDepartment, selectedSubRoom, userAccess]);

  return (
    <div className="w-full h-full flex gap-8 py-6">
      <div className="w-2/5 h-full flex flex-col gap-2">
        <Card className="flex flex-col gap-4 px-6 py-8 bg-transparent border-none">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Landmark Chat
          </CardTitle>
          <CardDescription
            className="animate-slide-left-fade-in"
            key={selectedDepartmentName}
          >
            You are currently chatting with{' '}
            {selectedDepartmentName === 'burgess-rawson' ? (
              <>
                everyone at <span className="font-bold">Burgess Rawson</span>!
              </>
            ) : (
              <>
                the{' '}
                <span className="font-bold capitalize">
                  {selectedDepartmentName.split('-').join(' ')}
                </span>{' '}
                {selectedSubRoom ? 'team.' : 'department.'}
              </>
            )}
          </CardDescription>
        </Card>
        <Card className="w-full h-full flex flex-col gap-2 p-2 border-none bg-transparent">
          {isLoadingRooms || isLoadingAccess ? (
            <div className="flex-grow flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <>
              <CardContent className="flex flex-col gap-2 p-0">
                {/* Authorized Departments */}
                {authorizedDepts.map((department, index) => (
                  <div key={department.id} className="w-full flex flex-col gap-2">
                    {/* Main department chat room */}
                    <StaggeredAnimation index={index * 2}>
                      <ChannelButton
                        departmentId={department.departments.id}
                        chatRoomId={department.id}
                        isSelected={
                          selectedDepartmentName ===
                          department.departments.department_name
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                        }
                        onClick={() =>
                          handleDepartmentSelect(
                            department.departments.id,
                            department.id,
                            department.team_id,
                            department.departments.department_name,
                          )
                        }
                      />
                    </StaggeredAnimation>

                    {/* Sub chat rooms */}
                    {department.subRooms?.map((subRoom, subIndex) => (
                      <StaggeredAnimation
                        key={subRoom.id}
                        index={index * 2 + subIndex + 1}
                      >
                        <ChannelButton
                          departmentId={subRoom.departments.id}
                          chatRoomId={subRoom.id}
                          isSubChannel={true}
                          isSelected={
                            selectedDepartmentName ===
                            subRoom.name.toLowerCase().replace(/\s+/g, '-')
                          }
                          onClick={() =>
                            handleDepartmentSelect(
                              subRoom.departments.id,
                              subRoom.id,
                              subRoom.team_id,
                              subRoom.name,
                            )
                          }
                          disabled={!userAccess?.teams?.includes(subRoom.team_id)}
                        />
                      </StaggeredAnimation>
                    ))}
                  </div>
                ))}

                {/* Only show separator if there are both authorized and unauthorized departments */}
                <div className="flex w-full justify-center">
                  {authorizedDepts.length > 0 && unauthorizedDepts.length > 0 && (
                    <Separator
                      className="my-8 animate-slide-left-fade-in opacity-0 [animation-delay:_3s] [animation-duration:_2s] [animation-fill-mode:_forwards] w-5/6"
                      key="separator"
                    />
                  )}
                </div>

                {/* Unauthorized Departments */}
                {unauthorizedDepts.map((department, index) => (
                  <div key={department.id}>
                    <StaggeredAnimation index={index * 2}>
                      <ChannelButton
                        departmentId={department.departments.id}
                        chatRoomId={department.id}
                        isSelected={false}
                        disabled={true}
                      />
                    </StaggeredAnimation>

                    {department.subRooms?.map((subRoom, subIndex) => (
                      <StaggeredAnimation
                        key={subRoom.id}
                        index={index * 2 + subIndex + 1}
                      >
                        <ChannelButton
                          departmentId={subRoom.departments.id}
                          chatRoomId={subRoom.id}
                          isSubChannel={true}
                          isSelected={false}
                          disabled={true}
                        />
                      </StaggeredAnimation>
                    ))}
                  </div>
                ))}
              </CardContent>
            </>
          )}
        </Card>
      </div>
      <Card className="w-3/5 h-full">
        {isLoadingRooms || isLoadingAccess ? (
          <div className="flex-grow w-full h-full flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : !hasAccess ? (
          <div className="flex-grow w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-12">
            <div className="flex flex-col items-center gap-2 w-1/2 animate-pulse">
              <MessageCircle className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-lg font-medium text-muted-foreground/50 w-full text-center">
                You don't have access to view this department's chat.
              </p>
            </div>
            <p className="text-sm text-warning-foreground w-1/2 text-center">
              If you believe this is an error, please contact the Technology department.
            </p>
          </div>
        ) : (
          <LiveChat
            chatName={selectedSubRoom?.name ?? selectedDepartment?.name}
            key={selectedSubRoom?.name ?? selectedDepartment?.name}
          />
        )}
      </Card>
    </div>
  );
};

// Wrap the export in a dynamic import with ssr disabled to prevent hydration issues
export default dynamic(() => Promise.resolve(Chat), {
  ssr: false,
});
