import { createBrowserClient } from '@/utils/supabase/client';
import { Department } from './types';

export const departmentsApi = {
  getAll: async () => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.from('departments').select('*').order('id');

    if (error) throw new Error(error.message);
    return data as Department[];
  },

  getByUserId: async (userId: string) => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('user_departments')
      .select('department_id')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return data.map((d) => d.department_id);
  },
};
