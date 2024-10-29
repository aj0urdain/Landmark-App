import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { userProfileOptions } from '@/types/userProfileTypes';

export function UserProfileManager() {
  const queryClient = useQueryClient();
  const supabase = createBrowserClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useQuery({
    ...userProfileOptions,
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAuthenticated(false);
        queryClient.clear();
        return null;
      }

      const { data, error } = await supabase
        .from('user_profile_complete')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw new Error('Failed to fetch user profile');

      return data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    refetchInterval: isAuthenticated ? 5 * 60 * 1000 : false,
  });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (event === 'SIGNED_IN') {
        void queryClient.invalidateQueries({
          queryKey: userProfileOptions.queryKey,
        });
      } else if (event === 'SIGNED_OUT') {
        queryClient.clear();
        localStorage.clear();
        sessionStorage.clear();
        void queryClient.invalidateQueries();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, queryClient]);

  useEffect(() => {
    if (isAuthenticated) {
      const channel = supabase
        .channel('public:user_profiles')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'user_profiles' },
          () => {
            void queryClient.invalidateQueries({
              queryKey: userProfileOptions.queryKey,
            });
          },
        )
        .subscribe();

      return () => {
        void supabase.removeChannel(channel);
      };
    }
  }, [supabase, queryClient, isAuthenticated]);

  return null;
}
