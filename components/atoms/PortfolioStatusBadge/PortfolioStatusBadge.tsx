import { Badge } from '@/components/ui/badge';
import { usePortfolioById } from '@/queries/portfolios/hooks';
import { useAuctionsByPortfolioId } from '@/queries/auctions/hooks';
import { isBefore, isAfter } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarCheck, Radio, CalendarClock } from 'lucide-react';

interface PortfolioStatusBadgeProps {
  portfolioId: number;
}

export function PortfolioStatusBadge({ portfolioId }: PortfolioStatusBadgeProps) {
  const { data: portfolio } = usePortfolioById(portfolioId);
  const { data: auctions } = useAuctionsByPortfolioId(portfolioId);

  if (!portfolio || !auctions) return null;

  const now = new Date();
  const getPortfolioStatus = () => {
    // If no signed schedule or no auctions, it's completed
    if (!portfolio.signed_schedule || auctions.length === 0) {
      return 'completed';
    }

    // Sort auctions by start date to get the last auction
    const sortedAuctions = [...auctions].sort((a, b) => {
      const dateA = a.start_date ? new Date(a.start_date) : new Date(0);
      const dateB = b.start_date ? new Date(b.start_date) : new Date(0);
      return dateA.getTime() - dateB.getTime();
    });

    const lastAuction = sortedAuctions[sortedAuctions.length - 1];
    const signedScheduleDate = new Date(portfolio.signed_schedule);

    // If today is after signed schedule but before last auction, it's live
    if (
      lastAuction.start_date &&
      isAfter(now, signedScheduleDate) &&
      isBefore(now, new Date(lastAuction.start_date))
    ) {
      return 'live';
    }

    // If we haven't reached signed schedule date yet, it's upcoming
    if (isBefore(now, signedScheduleDate)) {
      return 'upcoming';
    }

    // Otherwise it's completed
    return 'completed';
  };

  const status = getPortfolioStatus();

  const getStatusStyles = () => {
    switch (status) {
      case 'live':
        return 'bg-green-500/10 text-green-500 hover:border-green-500 hover:bg-green-500/20';
      case 'upcoming':
        return 'bg-blue-500/10 text-blue-500 hover:border-blue-500 hover:bg-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground hover:border-muted hover:bg-muted/20';
    }
  };

  return (
    <Badge
      variant={status === 'completed' ? 'secondary' : 'default'}
      className={cn(
        `transition-colors duration-300 w-fit select-none border border-transparent`,
        getStatusStyles(),
      )}
    >
      <div className="text-lg flex items-center gap-2">
        {status === 'live' && (
          <>
            <Radio className="h-4 w-4" />
            Live
          </>
        )}
        {status === 'upcoming' && (
          <>
            <CalendarClock className="h-4 w-4" />
            Upcoming
          </>
        )}
        {status === 'completed' && (
          <>
            <CalendarCheck className="h-4 w-4" />
            Completed
          </>
        )}
      </div>
    </Badge>
  );
}
