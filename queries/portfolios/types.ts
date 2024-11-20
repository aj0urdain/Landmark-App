import { Database } from '@/types/supabaseTypes';

type Tables = Database['public']['Tables'];

export type PortfolioRow = Tables['portfolios']['Row'];
export type AuctionRow = Tables['auctions']['Row'];
export type AuctionLocationRow = Tables['auction_locations']['Row'];
export type AuctionVenueRow = Tables['auction_venues']['Row'];

export type Portfolio = PortfolioRow;

export interface Auction {
  auction_id: AuctionRow['id'];
  start_date: AuctionRow['start_date'];
  end_date: AuctionRow['end_date'];
  auction_location: AuctionLocationRow['name'];
  venue: AuctionVenueRow['name'];
}

export interface PortfolioWithAuctions extends Portfolio {
  portfolio_id: number;
  auctions: Auction[];
}

export interface AuctionEvent {
  type: 'auction';
  title: string;
  start_date: string | null;
  end_date: string | null;
  portfolio_id: number;
  details: Auction;
}
