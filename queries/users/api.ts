import { createBrowserClient } from '@/utils/supabase/client';
import { User } from './types';

export const usersApi = {
  getAll: async () => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('user_profile_complete')
      .select('*')
      .order('work_anniversary', { ascending: true });

    if (error) throw new Error(error.message);
    return data as User[];
  },

  getById: async (userId: string) => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('user_profile_complete')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw new Error(error.message);
    return data as User;
  },
};
