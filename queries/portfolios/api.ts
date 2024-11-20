import { createBrowserClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabaseTypes';
import { useQueryClient } from '@tanstack/react-query';

type Portfolio = Database['public']['Tables']['portfolios']['Row'];

export async function getAllPortfolios() {
  const supabase = createBrowserClient();

  const { data: portfolios, error } = await supabase
    .from('portfolios')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return portfolios as Portfolio[];
}

export async function getPortfolioById(id: number): Promise<Portfolio | null> {
  const queryClient = useQueryClient();

  // First, try to get from cache
  const cachedPortfolios = queryClient.getQueryData<Portfolio[]>(['portfolios']);

  if (cachedPortfolios) {
    const portfolio = cachedPortfolios.find((p) => p.id === id);
    if (portfolio) return portfolio;
  }

  // If not in cache, fetch from API
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw new Error(error.message);
  }

  return data as Portfolio;
}
