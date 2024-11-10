import { Button } from '@/components/ui/button';
import { MessageCircle, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';

interface ChannelButtonProps {
  departmentId: number;
  isSelected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const ChannelButton = ({
  departmentId,
  isSelected,
  disabled = false,
  onClick,
}: ChannelButtonProps) => {
  const supabase = createBrowserClient();

  // Fetch department name
  const { data: department } = useQuery({
    queryKey: ['department', departmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('department_name, id')
        .eq('id', departmentId)
        .single();

      if (error) {
        console.error('Error fetching department:', error);
        throw error;
      }

      console.log('department data', data);
      return data;
    },
  });

  // Fetch user count
  const { data: userCount } = useQuery({
    queryKey: ['departmentUserCount', departmentId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_departments')
        .select('*', { count: 'exact', head: true })
        .eq('department_id', departmentId);

      if (error) throw error;

      console.log('userCount', count);
      return count;
    },
  });

  if (!department) return null;

  return (
    <Button
      className="w-full"
      variant={isSelected ? 'default' : 'outline'}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-2">
          <MessageCircle className={`w-4 h-4 ${disabled ? 'opacity-50' : ''}`} />
          <h1 className={`text-sm font-medium ${disabled ? 'opacity-50' : ''}`}>
            {department?.department_name}
          </h1>
        </div>
        {userCount !== null && userCount > 0 && (
          <div
            className={`flex items-center gap-1 text-muted-foreground ${disabled ? 'opacity-50' : ''}`}
          >
            <Users className="w-3 h-3" />
            <p className="text-xs">{userCount}</p>
          </div>
        )}
      </div>
    </Button>
  );
};

export default ChannelButton;
