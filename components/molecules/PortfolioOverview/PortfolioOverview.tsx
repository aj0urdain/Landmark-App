import { usePortfolioById } from '@/queries/portfolios/hooks';
import { useAuctionsByPortfolioId } from '@/queries/auctions/hooks';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ChevronsRight, Gavel } from 'lucide-react';
import { eventTypeInfo } from '@/utils/eventTypeInfo';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import ReactTimeAgo from 'react-time-ago';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';

interface TimelineEvent {
  key: keyof typeof eventTypeInfo;
  date: string | null;
  endDate?: string | null;
}

// Helper function for date formatting
const formatSafeDate = (dateString: string | null) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return format(date, 'PPP');
  } catch {
    return null;
  }
};

export default function PortfolioOverview({ portfolioId }: { portfolioId: string }) {
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolioById(
    parseInt(portfolioId),
  );
  const { data: auctions, isLoading: auctionsLoading } = useAuctionsByPortfolioId(
    parseInt(portfolioId),
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hoveredEventKey, setHoveredEventKey] = useState<string | null>(null);

  const isLoading = portfolioLoading || auctionsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!portfolio) return <div>Portfolio not found</div>;

  // Create timeline events array and sort by date
  const timelineEvents: TimelineEvent[] = Object.keys(eventTypeInfo)
    .filter(
      (key) =>
        key !== 'default' &&
        key !== 'birthday' &&
        key !== 'work_anniversary' &&
        key !== 'training',
    )
    .map((key) => ({
      key: key as keyof typeof eventTypeInfo,
      date: portfolio[key as keyof typeof portfolio] as string | null,
      endDate:
        key === 'advertising_period_start'
          ? (portfolio.advertising_period_end as string | null)
          : undefined,
    }));

  // Filter out null dates and sort by date
  const sortedEvents = timelineEvents
    .filter((event) => event.date !== null)
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  const handleAuctionClick = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const tab = current.get('tab');

    if (tab === 'auctions') {
      current.delete('tab');
    } else {
      current.set('tab', 'auctions');
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';

    router.push(`${window.location.pathname}${query}`);
  };

  const isAuctionsTab = searchParams.get('tab') === 'auctions';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Portfolio Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 grid-cols-3">
          {sortedEvents.map((event, index) => {
            const info = eventTypeInfo[event.key];
            const Icon = info.icon;
            const formattedDate = formatSafeDate(event.date);
            const formattedEndDate = event.endDate ? formatSafeDate(event.endDate) : null;
            const isPastEvent = new Date(event.date!) < new Date();
            const eventKey = `${event.key}-${event.date}`;

            if (!formattedDate) return null;

            return (
              <StaggeredAnimation key={eventKey} index={index} baseDelay={0.1}>
                <div className="flex items-center gap-4 select-none">
                  <div
                    className={`relative flex flex-1 flex-col rounded-lg border p-4 shadow-sm transition-all hover:shadow-md ${
                      isPastEvent ? 'opacity-75' : ''
                    }`}
                    style={{
                      borderColor: info.bgColor as string,
                      backgroundColor: `${info.bgColor}10`,
                    }}
                    onMouseEnter={() => setHoveredEventKey(eventKey)}
                    onMouseLeave={() => setHoveredEventKey(null)}
                  >
                    <div
                      className={`text-xs ${isPastEvent ? 'text-muted-foreground' : ''}`}
                    >
                      {hoveredEventKey === eventKey ? (
                        <div className="animate-slide-down-fade-in">
                          <ReactTimeAgo date={new Date(event.date!)} />
                        </div>
                      ) : (
                        <div className="animate-slide-up-fade-in">
                          {formattedDate}
                          {formattedEndDate && (
                            <>
                              {' - '}
                              {formattedEndDate}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Icon
                        className={`h-4 w-4 ${isPastEvent ? 'text-muted-foreground' : ''}`}
                        style={{
                          color: isPastEvent ? undefined : (info.bgColor as string),
                        }}
                      />
                      <h3
                        className={`font-semibold ${isPastEvent ? 'text-muted-foreground' : ''}`}
                      >
                        {info.label}
                      </h3>
                    </div>
                  </div>
                  {index < sortedEvents.length - 1 && (
                    <ChevronsRight className="h-6 w-6 text-muted-foreground/50" />
                  )}
                </div>
              </StaggeredAnimation>
            );
          })}
        </div>

        {/* Auction Week Card */}
        <div className="col-span-3 cursor-pointer" onClick={handleAuctionClick}>
          <div
            className={cn(
              `relative flex flex-col group/auction-week hover:bg-muted/10 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md`,
            )}
          >
            <div className="flex flex-col items-center justify-center gap-2 h-36">
              <Gavel className="h-10 group-hover/auction-week:animate-gavel-hit w-10 text-muted-foreground transition-colors duration-500 group-hover/auction-week:text-foreground" />
              <h3
                className={`font-extrabold text-muted-foreground transition-colors duration-500 group-hover/auction-week:text-foreground text-4xl`}
              >
                Auction Week
              </h3>
              <div className="flex gap-2">
                {auctions?.map((auction) => (
                  <Badge
                    key={auction.id}
                    className="text-muted-foreground transition-colors duration-500 group-hover/auction-week:text-foreground"
                    style={{
                      backgroundColor: `${
                        eventTypeInfo.auction.bgColor[
                          auction.auction_locations
                            ?.name as keyof typeof eventTypeInfo.auction.bgColor
                        ] || eventTypeInfo.auction.bgColor.default
                      }20`,
                      borderColor:
                        eventTypeInfo.auction.bgColor[
                          auction.auction_locations
                            ?.name as keyof typeof eventTypeInfo.auction.bgColor
                        ] || eventTypeInfo.auction.bgColor.default,
                      borderWidth: '1px',
                    }}
                  >
                    {auction.auction_locations?.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
