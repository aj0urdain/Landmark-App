import { createBrowserClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabaseTypes';
import { useAllPortfolios } from './hooks';

type Portfolio = Database['public']['Tables']['portfolios']['Row'];
type PortfolioWithAuctions = Awaited<ReturnType<typeof getActivePortfolioWithAuctions>>;

export async function getAllPortfolios() {
  const supabase = createBrowserClient();

  const { data: portfolios, error } = await supabase
    .from('portfolios')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error('📄 Error fetching all portfolios:', error);
    throw new Error(error.message);
  }

  console.log('📄 All portfolios:', portfolios);

  return portfolios as Portfolio[];
}

export async function getPortfolioById(id: number): Promise<Portfolio | null> {
  const supabase = createBrowserClient();

  console.log('📄 Portfolio ID in API:', id);

  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw new Error(error.message);
  }

  return data;
}

export async function getActivePortfolioWithAuctions() {
  const supabase = createBrowserClient();

  const { data, error } = await supabase.rpc('get_active_portfolio_with_auctions');

  if (error) {
    console.error('📄 Error fetching active portfolio with auctions:', error);
    throw new Error(error.message);
  }

  console.log('📄 Active portfolio with auctions:', data);

  return data;
}
