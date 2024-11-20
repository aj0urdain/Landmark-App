import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import {
  addDays,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
  parseISO,
  isAfter,
  isBefore,
} from 'date-fns';
import { useMemo, useState } from 'react';
import { useCalendarEvents } from '@/utils/getCalendarEvents';
import { EventCard } from '@/components/molecules/EventCard/EventCard';
import { Calendar, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { createBrowserClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Dot } from '@/components/atoms/Dot/Dot';

export default function DashboardEventsPreview() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [month, setMonth] = useState(new Date());
  const { data: events, isLoading, error } = useCalendarEvents('portfolio');
  const supabase = createBrowserClient();

  // Calculate the start and end of the week for the selected date
  const selectedWeek = useMemo(() => {
    const start = startOfWeek(selectedDate);
    const end = endOfWeek(selectedDate);
    return { from: start, to: end };
  }, [selectedDate]);

  // Generate an array of 7 days starting from the week start
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(selectedWeek.from, i));
  }, [selectedWeek]);

  // Modified setSelectedDate function
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setMonth(date); // Update the month when a date is selected
    } else {
      // If date is undefined (user trying to unselect), keep the current week
      const newDate = new Date();
      setSelectedDate(newDate);
      setMonth(newDate);
    }
  };

  // Filter events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!events) return [];
    return events.filter((event) => {
      const eventStartDate = parseISO(event.start_date);
      const eventEndDate = event.end_date ? parseISO(event.end_date) : eventStartDate;
      return (
        isSameDay(selectedDate, eventStartDate) ||
        (isAfter(selectedDate, eventStartDate) && isBefore(selectedDate, eventEndDate)) ||
        isSameDay(selectedDate, eventEndDate)
      );
    });
  }, [selectedDate, events]);

  const { data: activePortfolio, isLoading: activePortfolioLoading } = useQuery({
    queryKey: ['activePortfolioPreview'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_active_portfolio_with_auctions');

      if (error) throw error;

      // Add type assertion for the data
      const typedData = data as unknown as PortfolioWithAuctions;

      // Sort auctions by date to find the closest one
      const sortedAuctions = typedData.auctions.sort(
        (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
      );

      // Get the closest auction
      const closestAuction = sortedAuctions[0];

      // Calculate days until auction
      const today = new Date();
      const auctionDate = new Date(closestAuction.start_date);
      const daysUntilAuction = Math.ceil(
        (auctionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      return {
        ...typedData,
        closestAuctionPortfolioId: typedData.portfolio_id,
        daysUntilAuction,
      };
    },
  });

  if (activePortfolioLoading)
    return (
      <Card className="col-span-8 flex flex-col items-center justify-center h-full w-full p-6 opacity-80 hover:opacity-100 transition-all duration-150 ease-linear">
        <Loader2 className="w-4 h-4 animate-spin" />
      </Card>
    );

  return (
    <Card className="col-span-8 flex flex-col h-full w-full p-6 opacity-80 hover:opacity-100 transition-all duration-150 ease-linear">
      <div className="flex items-center gap-3 group">
        <Link
          href={`/wiki/library/portfolios/${String(activePortfolio?.closestAuctionPortfolioId)}`}
          className="flex items-center gap-2 text-sm group/portfolio-link font-semibold cursor-pointer transition-all duration-150 ease-linear"
        >
          <Calendar className="w-4 h-4 text-muted-foreground group-hover/portfolio-link:text-green-400" />
          <div className="flex items-center gap-1 animated-underline-1 text-green-400">
            <p className="text-muted-foreground group-hover/portfolio-link:text-green-400">
              Active Portfolio
            </p>
            <p className="text-primary text-base group-hover/portfolio-link:text-green-400">
              {activePortfolio?.closestAuctionPortfolioId}
            </p>
          </div>
        </Link>
        <Dot
          size="small"
          className="bg-green-400 group-hover/portfolio-link:bg-primary animate-pulse"
        />
        <Link
          href={`/events/auctions/${String(
            activePortfolio?.closestAuctionPortfolioId,
          )}/${String(activePortfolio?.auctions[0].auction_location)}`} // needs to be events/auctions/portfolioid/auctionlocation
          className="flex items-center gap-2 group cursor-pointer transition-all duration-150 ease-linear animated-underline-1 text-muted-foreground/75 group-hover:text-muted-foreground"
        >
          {/* Put number of days until closest auction */}
          <p className="text-xs font-medium">
            {activePortfolio?.daysUntilAuction} days until next auction
          </p>
        </Link>
      </div>
      <CardContent className="flex flex-col gap-6 pt-6 px-0">
        <div className="grid w-full grid-cols-7 gap-2">
          {weekDays.map((day, index) => (
            <StaggeredAnimation
              baseDelay={0}
              incrementDelay={0.05}
              key={index + day.getTime()}
              index={index}
            >
              <Card
                key={index + day.getTime()}
                className={`relative h-16 animate-slide-down-fade-in group cursor-pointer duration-150 p-2 transition-all ease-linear ${
                  isSameDay(day, selectedDate)
                    ? 'border-2 border-primary bg-primary'
                    : isSameDay(day, new Date())
                      ? 'border-2 border-muted bg-muted/50 hover:bg-primary/5'
                      : 'hover:border-muted-foreground/50 hover:scale-105 hover:border-2'
                }`}
                onClick={() => {
                  handleDateSelect(day);
                }}
              >
                <div
                  className={`text-xs font-semibold uppercase ${
                    isSameDay(day, new Date()) && !isSameDay(day, selectedDate)
                      ? 'text-primary/80'
                      : ''
                  } ${
                    isSameDay(day, selectedDate)
                      ? 'text-secondary'
                      : 'text-muted-foreground/60 group-hover:text-primary'
                  }`}
                >
                  {format(day, 'EEE')}
                </div>
                <div
                  className={`absolute bottom-1 right-2 flex items-start justify-center gap-1 ${
                    isSameDay(day, new Date()) && !isSameDay(day, selectedDate)
                      ? 'text-primary/80'
                      : ''
                  } ${isSameDay(day, selectedDate) ? 'text-secondary' : 'text-muted'}`}
                >
                  <p className="mt-[0.23rem] text-xs font-semibold uppercase leading-none">
                    {format(day, 'MMM')}
                  </p>
                  <p className="text-xl font-bold leading-none">{format(day, 'd')}</p>
                </div>
              </Card>
            </StaggeredAnimation>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            <Card className="p-4">
              <CardTitle>Loading events...</CardTitle>
            </Card>
          ) : error ? (
            <Card className="p-4">
              <CardTitle>Error loading events</CardTitle>
              <CardDescription>{error.message}</CardDescription>
            </Card>
          ) : selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event, index) => (
              <StaggeredAnimation
                baseDelay={0}
                incrementDelay={0.05}
                key={`${index.toString()}-${event.start_date}`}
                index={index}
                fadeDirection="left"
              >
                <EventCard key={index} event={event} variant="preview" />
              </StaggeredAnimation>
            ))
          ) : (
            <Card className="p-4">
              <CardTitle>No events</CardTitle>
              <CardDescription>No events scheduled for this day</CardDescription>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
