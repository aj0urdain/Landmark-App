import { createBrowserClient } from '@/utils/supabase/client';

export const auctionsApi = {
  getAll: async () => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('auctions')
      .select(
        `
        *,
        auction_locations(name),
        auction_venues(name, image)
      `,
      )
      .order('start_date', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  getById: async (auctionId: number) => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('auctions')
      .select(
        `
        *,
        auction_locations(name),
        auction_venues(name, image)
      `,
      )
      .eq('id', auctionId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  getFutureAuctions: async () => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('auctions')
      .select(
        `
        *,
        auction_locations(name),
        auction_venues(name, image)
      `,
      )
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  getPastAuctions: async () => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('auctions')
      .select(
        `
        *,
        auction_locations(name),
        auction_venues(name, image)
      `,
      )
      .lt('start_date', new Date().toISOString())
      .order('start_date', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  getByPortfolioId: async (portfolioId: number) => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('auctions')
      .select(
        `
        *,
        auction_locations(name),
        auction_venues(name, image)
      `,
      )
      .eq('portfolio_id', portfolioId)
      .order('start_date', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },
};
