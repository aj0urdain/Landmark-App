import { createBrowserClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import type { UserProfile } from '@/types/userProfileTypes'; // adjust type as needed

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;

      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('user_profile_complete')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    },
    enabled: !!userId,
  });
}
