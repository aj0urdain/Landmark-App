import { useQuery } from '@tanstack/react-query';
import { getAllPortfolios, getPortfolioById } from './api';

export const portfolioKeys = {
  all: ['portfolios'] as const,
  byId: (id: number) => [...portfolioKeys.all, 'portfolio', id] as const,
};

export function useAllPortfolios() {
  return useQuery({
    queryKey: portfolioKeys.all,
    queryFn: getAllPortfolios,
  });
}

export function usePortfolioById(id: number) {
  const { data: portfolios } = useAllPortfolios();

  return useQuery({
    queryKey: portfolioKeys.byId(id),
    queryFn: async () => {
      // First try to get from cached portfolios
      const cachedPortfolio = portfolios?.find((p) => p.id === id);
      if (cachedPortfolio) return cachedPortfolio;

      // If not in cache, fetch individually
      return await getPortfolioById(id);
    },
    enabled: !!id,
  });
}
