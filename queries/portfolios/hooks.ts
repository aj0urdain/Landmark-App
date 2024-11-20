import { useQuery } from '@tanstack/react-query';
import { getAllPortfolios } from './api';

export const portfolioKeys = {
  all: ['portfolios'] as const,
};

export function useAllPortfolios() {
  return useQuery({
    queryKey: portfolioKeys.all,
    queryFn: getAllPortfolios,
  });
}
