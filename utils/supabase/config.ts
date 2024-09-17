import { createServiceRoleClient } from '@/utils/supabase/server';

export async function getConfig<T>(key: string): Promise<T | null> {
  const supabaseAdmin = createServiceRoleClient();
  const { data, error } = await supabaseAdmin
    .from('app_config')
    .select('value')
    .eq('key', key)
    .single();

  if (error) {
    console.error(`Error fetching config for key ${key}:`, error);
    return null;
  }

  return data.value as T;
}