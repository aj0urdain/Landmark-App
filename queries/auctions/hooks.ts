import { useQuery } from '@tanstack/react-query';
import { auctionsApi } from './api';

export const auctionKeys = {
  all: ['auctions'] as const,
  byId: (id: number) => [...auctionKeys.all, 'auction', id] as const,
  byPortfolioId: (portfolioId: number) =>
    [...auctionKeys.all, 'portfolio', portfolioId] as const,
  future: () => [...auctionKeys.all, 'future'] as const,
  past: () => [...auctionKeys.all, 'past'] as const,
};

export function useAuctions() {
  return useQuery({
    queryKey: auctionKeys.all,
    queryFn: () => auctionsApi.getAll(),
  });
}

export function useAuction(auctionId: number) {
  const { data: auctions } = useAuctions();

  return useQuery({
    queryKey: auctionKeys.byId(auctionId),
    queryFn: async () => {
      // First try to get from cached auctions
      const cachedAuction = auctions?.find((auction) => auction.id === auctionId);
      if (cachedAuction) return cachedAuction;

      // If not in cache, fetch individually
      return await auctionsApi.getById(auctionId);
    },
    enabled: !!auctionId,
  });
}

export function useFutureAuctions() {
  return useQuery({
    queryKey: auctionKeys.future(),
    queryFn: () => auctionsApi.getFutureAuctions(),
  });
}

export function usePastAuctions() {
  return useQuery({
    queryKey: auctionKeys.past(),
    queryFn: () => auctionsApi.getPastAuctions(),
  });
}

export function useAuctionsByPortfolioId(portfolioId: number) {
  return useQuery({
    queryKey: auctionKeys.byPortfolioId(portfolioId),
    queryFn: () => auctionsApi.getByPortfolioId(portfolioId),
    enabled: !!portfolioId,
  });
}
