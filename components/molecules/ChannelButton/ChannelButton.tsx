import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Hash, ChevronRight, ChevronsRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { getDepartmentInfo } from '@/utils/getDepartmentInfo';
import CountUp from 'react-countup';

interface ChannelButtonProps {
  departmentId: number;
  chatRoomId: number;
  isSelected: boolean;
  isSubChannel?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const ChannelButton = ({
  departmentId,
  chatRoomId,
  isSelected,
  disabled = false,
  onClick,
  isSubChannel = false,
}: ChannelButtonProps) => {
  const supabase = createBrowserClient();

  // Fetch chat room details
  const { data: chatRoom } = useQuery({
    queryKey: ['chatRoom', chatRoomId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select(
          `
          name, 
          id, 
          parent_room, 
          team_id,
          departments(id, department_name)
        `,
        )
        .eq('id', chatRoomId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch user count - either department or team members
  const { data: userCount } = useQuery({
    queryKey: ['channelUserCount', chatRoomId, isSubChannel],
    queryFn: async () => {
      if (chatRoom?.team_id) {
        // Count team members
        const { count, error } = await supabase
          .from('user_teams')
          .select('*', { count: 'exact', head: true })
          .eq('team_id', chatRoom.team_id);

        if (error) throw error;
        return count;
      } else {
        // Count department members
        const { count, error } = await supabase
          .from('user_departments')
          .select('*', { count: 'exact', head: true })
          .eq('department_id', departmentId);

        if (error) throw error;
        return count;
      }
    },
    enabled: !!chatRoom,
  });

  const departmentDetails = chatRoom?.departments?.department_name
    ? getDepartmentInfo(chatRoom.departments.department_name)
    : undefined;

  if (!chatRoom) return null;

  return (
    <div className="w-full flex items-center gap-2">
      {isSubChannel && (
        <div className="w-fit flex items-center justify-center text-muted-foreground/50">
          <ChevronsRight className={`w-4 h-4 ml-4 ${disabled ? 'opacity-50' : ''}`} />
        </div>
      )}
      <Button
        className={`w-full bg-transparent hover:bg-transparent hover:border-foreground hover:text-foreground 
        text-muted-foreground/50 transition-all duration-300 
        ${isSelected ? 'border-foreground/50 text-foreground bg-foreground/5' : ''}
       
        `}
        variant={isSelected ? 'outline' : 'ghost'}
        onClick={onClick}
        disabled={disabled}
      >
        <div className="flex items-center justify-between w-full gap-2">
          <div
            className={`flex items-center ${isSelected ? 'text-foreground' : ''} ${isSubChannel ? 'gap-1' : 'gap-2'}`}
          >
            {isSubChannel ? (
              <Users className={`w-3 h-3 ${disabled ? 'opacity-50' : ''}`} />
            ) : departmentDetails ? (
              <departmentDetails.icon
                className={`w-4 h-4 ${disabled ? 'opacity-50' : ''}`}
              />
            ) : (
              <MessageCircle className={`w-4 h-4 ${disabled ? 'opacity-50' : ''}`} />
            )}
            <h1
              className={`font-medium ${disabled ? 'opacity-50' : ''} ${isSubChannel ? 'text-xs' : 'text-sm'}`}
            >
              {chatRoom.name}
            </h1>
          </div>
          {userCount !== null && userCount > 0 && (
            <div
              className={`flex items-center gap-1 text-muted-foreground ${disabled ? 'opacity-50' : ''}`}
            >
              <Users className="w-3 h-3" />
              <p className="text-xs">
                <CountUp start={0} end={userCount ?? 0} duration={2} useEasing />
              </p>
            </div>
          )}
        </div>
      </Button>
    </div>
  );
};

export default ChannelButton;
