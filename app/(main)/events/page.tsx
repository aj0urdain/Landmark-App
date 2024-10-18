'use client';

import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';

import { CalendarIcon, CakeIcon, BriefcaseIcon, ChevronsLeft } from 'lucide-react';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  addDays,
  startOfWeek,
  endOfWeek,
  format,
  isSameDay,
  isAfter,
  parseISO,
  isBefore,
  differenceInYears,
} from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';
import { BookOpenText, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CalendarEvent,
  MemoizedEventCalendar,
} from '@/components/molecules/EventCalendar/EventCalendar';
import { useCalendarEvents } from '@/utils/getCalendarEvents';

import { EventCard } from '@/components/molecules/EventCard/EventCard';
import { CalendarLogic } from '@/components/molecules/CalendarLogic/CalendarLogic';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dot } from '@/components/atoms/Dot/Dot';
import { createBrowserClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Event } from '@/components/molecules/CompanyCalendar/CompanyCalendar';
import CountUp from 'react-countup';
import { useRouter, useSearchParams } from 'next/navigation';
import { StaffHighlightSection } from '@/components/molecules/StaffHighlightSection/StaffHighlightSection';

interface Auction {
  venue: string;
  end_date: string | null;
  auction_id: number;
  start_date: string;
  auction_location: string;
}

interface PortfolioWithAuctions {
  afr: string;
  auctions: Auction[];
  created_at: string;
  bcm_natives: string;
  hsagesmh_w1: string;
  hsagesmh_w2: string;
  portfolio_id: number;
  magazine_print: string;
  press_bookings: string;
  signed_schedule: string;
  magazine_deadline: string;
  adelaide_advertiser: string;
  advertising_period_end: string;
  advertising_period_start: string;
}

interface StaffEvent {
  work_anniversary: string;
  birthday: string;
  nextOccurrence: Date;
  eventType: 'work_anniversary' | 'birthday';
  // Add other necessary properties
}

const EventsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const portfolioRef = useRef<HTMLDivElement>(null);
  const staffRef = useRef<HTMLDivElement>(null);
  const trainingRef = useRef<HTMLDivElement>(null);
  const upcomingRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('highlightTab', value);
    router.push(`/events?${params.toString()}`);

    // Scroll to the appropriate section
    const refMap: Record<string, React.RefObject<HTMLDivElement>> = {
      portfolio: portfolioRef,
      staff: staffRef,
      training: trainingRef,
      upcoming: upcomingRef,
    };

    const ref = refMap[value];
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const useGetStaffEvents = () => {
    const supabase = createBrowserClient();

    return useQuery({
      queryKey: ['staffEvents'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('user_profile_complete')
          .select('*')
          .not('birthday', 'is', null)
          .not('work_anniversary', 'is', null);

        if (error) throw error;
        return data;
      },
    });
  };

  const getUpcomingEvents = (
    data: Event[],
    eventType: 'work_anniversary' | 'birthday',
    limit = 5,
  ): StaffEvent[] => {
    const today = new Date();
    const currentYear = today.getFullYear();

    return data
      .map((user: unknown) => {
        const date = new Date(user[eventType] as unknown as string);
        const nextOccurrence = new Date(currentYear, date.getMonth(), date.getDate());
        if (nextOccurrence < today) {
          nextOccurrence.setFullYear(currentYear + 1);
        }
        return { ...user, nextOccurrence, eventType };
      })
      .sort((a: unknown, b: unknown) => a.nextOccurrence - b.nextOccurrence)
      .slice(0, limit);
  };

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(selectedDate);
  const todayButtonRef = useRef<HTMLButtonElement>(null);
  const { data: userProfileData, isLoading: isLoadingUserProfile } = useGetStaffEvents();

  const upcomingBirthdays = useMemo(
    () => (userProfileData ? getUpcomingEvents(userProfileData, 'birthday') : []),
    [userProfileData],
  );

  const upcomingWorkAnniversaries = useMemo(
    () => (userProfileData ? getUpcomingEvents(userProfileData, 'work_anniversary') : []),
    [userProfileData],
  );

  useEffect(() => {
    todayButtonRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, []);

  const useActivePortfolio = () => {
    return useQuery({
      queryKey: ['activePortfolio'],
      queryFn: async () => {
        const supabase = createBrowserClient();

        const { data, error } = await supabase.rpc('get_active_portfolio_with_auctions');

        if (error) throw error;

        // Add type assertion here
        const typedData = data as unknown as PortfolioWithAuctions;

        // Transform auctions into events
        const auctionEvents = typedData.auctions.map((auction: Auction) => ({
          type: 'auction' as const,
          title: `${auction.auction_location} Auction`,
          start_date: auction.start_date,
          end_date: auction.end_date,
          portfolio_id: typedData.portfolio_id,
          details: auction,
        }));

        // Calculate days until first auction
        const today = new Date();
        const sortedAuctions = auctionEvents.sort(
          (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
        );
        const firstAuction = sortedAuctions[0];
        const daysUntilAuction = Math.ceil(
          (new Date(firstAuction.start_date).getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        return {
          ...typedData,
          auctionEvents,
          daysUntilAuction,
        };
      },
    });
  };

  const { data: events, isLoading, error } = useCalendarEvents();
  const { data: activePortfolio, isLoading: isLoadingPortfolio } = useActivePortfolio();

  useEffect(() => {
    const highlightTab = searchParams.get('highlightTab');
    if (highlightTab) {
      handleTabChange(highlightTab);
    }
  }, [searchParams, handleTabChange]);

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

  const today = useMemo(() => new Date(), []);

  const handleJumpToToday = () => {
    setSelectedDate(today);
    setMonth(today); // Update the month when jumping to today
  };

  const isTodaySelected = isSameDay(selectedDate, today);
  const isTodayAfterSelected = isAfter(today, selectedDate);

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

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-12">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="flex w-full justify-start">
          <Button
            ref={todayButtonRef}
            className="flex items-center justify-center gap-1"
            variant="outline"
            onClick={handleJumpToToday}
            disabled={isTodaySelected}
          >
            <ChevronsLeft
              className={`h-4 w-4 transition-all ${
                isTodaySelected ? '-rotate-90' : isTodayAfterSelected ? 'rotate-180' : ''
              }`}
            />
            <p className="text-xs font-semibold uppercase">Today</p>
          </Button>
        </div>
        <div className="grid w-full grid-cols-7 gap-4">
          {weekDays.map((day, index) => (
            <StaggeredAnimation
              baseDelay={0}
              incrementDelay={0.05}
              key={index + day.getTime()}
              index={index}
            >
              <Card
                key={index + day.getTime()}
                className={`relative h-16 animate-slide-down-fade-in cursor-pointer p-2 transition-all ease-linear ${
                  isSameDay(day, selectedDate)
                    ? 'border-2 border-primary bg-primary'
                    : isSameDay(day, new Date())
                      ? 'border-2 border-muted bg-muted/50 hover:bg-primary/5'
                      : 'hover:bg-primary/5'
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
                      : 'text-muted-foreground/60'
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
                  <p className="mt-[0.225rem] text-xs font-semibold uppercase leading-none">
                    {format(day, 'MMM')}
                  </p>
                  <p className="text-4xl font-bold leading-none">{format(day, 'd')}</p>
                </div>
              </Card>
            </StaggeredAnimation>
          ))}
        </div>
      </div>

      <div className="flex w-full items-start justify-start gap-6">
        <div className="-mt-5 animate-slide-left-fade-in opacity-0 ease-in-out [animation-delay:0.75s] [animation-fill-mode:forwards]">
          {isLoading ? (
            <div>Loading calendar...</div>
          ) : error ? (
            <div>Error loading calendar: {error.message}</div>
          ) : (
            <CalendarLogic events={events as CalendarEvent[]}>
              {(modifiers, modifiersStyles) => (
                <MemoizedEventCalendar
                  events={events as CalendarEvent[]}
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                  month={month}
                  onMonthChange={setMonth as (date: Date | undefined) => void}
                  className="w-full"
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                  showWeekNumbers
                />
              )}
            </CalendarLogic>
          )}
        </div>

        <div className="w-full animate-slide-right-fade-in opacity-0 ease-in-out [animation-delay:0.75s] [animation-fill-mode:forwards]">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <p
              key={selectedDate.getTime()}
              className="animate-slide-left-fade-in text-lg font-semibold"
            >
              {format(selectedDate, 'MMMM d')}
            </p>
          </div>
          <CardContent className="mt-4 grid grid-cols-2 gap-4 p-0">
            {selectedDateEvents.length > 0 ? (
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
          </CardContent>
        </div>
      </div>
      <Separator className="my-12 w-3/4" />
      <div className="flex w-full flex-col items-start justify-start gap-4">
        <Tabs
          defaultValue={searchParams.get('highlightTab') ?? 'portfolio'}
          className="flex w-full flex-col items-center justify-start gap-2"
          onValueChange={handleTabChange}
        >
          <div className="flex w-full items-center justify-center gap-4">
            <Dot size="small" className="bg-muted" />
            <Dot size="large" className="bg-muted-foreground/50" />

            <h1 className="text-2xl font-semibold uppercase tracking-widest">
              Event Highlights
            </h1>
            <Dot size="large" className="bg-muted-foreground/50" />
            <Dot size="small" className="bg-muted" />
          </div>

          <TabsList className="w-1/3 gap-6 bg-transparent">
            <TabsTrigger
              value="portfolio"
              className="group gap-2 py-2 data-[state=active]:border-b data-[state=active]:border-foreground data-[state=active]:font-bold data-[state=active]:text-foreground"
            >
              <BookOpenText className="h-3 w-3" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger
              value="staff"
              className="group gap-2 py-2 data-[state=active]:border-b data-[state=active]:border-foreground data-[state=active]:font-bold data-[state=active]:text-foreground"
            >
              <Users className="h-3 w-3" />
              Staff
            </TabsTrigger>
            <TabsTrigger
              value="training"
              className="group gap-2 py-2 data-[state=active]:border-b data-[state=active]:border-foreground data-[state=active]:font-bold data-[state=active]:text-foreground"
            >
              <GraduationCap className="h-3 w-3" />
              Training
            </TabsTrigger>
          </TabsList>
          <TabsContent value="portfolio" ref={portfolioRef} className="w-full">
            {isLoadingPortfolio ? (
              <Card className="p-4">
                <CardTitle>Loading active portfolio...</CardTitle>
              </Card>
            ) : activePortfolio ? (
              <div className="flex w-full flex-col items-center justify-center space-y-4">
                <div className="grid w-1/2 grid-cols-2 gap-4">
                  <div className="flex h-48 animate-slide-right-fade-in flex-col items-center justify-center gap-1.5 opacity-0 [animation-duration:_2s] [animation-fill-mode:_forwards]">
                    <h1 className="flex animate-slide-down-fade-in items-start gap-1 text-7xl font-bold opacity-0 [animation-duration:_2s] [animation-fill-mode:_forwards]">
                      <CountUp
                        start={100}
                        end={activePortfolio.portfolio_id || 0}
                        duration={5}
                        useEasing
                      />
                    </h1>
                    <p className="animate-slide-up-fade-in text-xs font-semibold uppercase tracking-widest text-muted-foreground opacity-0 [animation-delay:_3s] [animation-duration:_2s] [animation-fill-mode:_forwards]">
                      Current Portfolio
                    </p>
                  </div>
                  <div className="flex animate-slide-right-fade-in flex-col items-center justify-center gap-1.5 opacity-0 [animation-delay:_4s] [animation-duration:_4s] [animation-fill-mode:_forwards]">
                    <h1 className="flex animate-slide-down-fade-in items-start gap-1 text-7xl font-bold opacity-0 [animation-delay:_4s] [animation-duration:_4s] [animation-fill-mode:_forwards]">
                      <CountUp
                        start={100}
                        end={activePortfolio.daysUntilAuction || 0}
                        duration={5}
                        delay={4}
                        useEasing
                      />
                    </h1>
                    <p className="animate-slide-up-fade-in text-xs font-semibold uppercase tracking-widest text-muted-foreground opacity-0 [animation-delay:_7s] [animation-duration:_2s] [animation-fill-mode:_forwards]">
                      Days Until Auction
                    </p>
                  </div>
                </div>

                <div className="grid w-full grid-cols-3 gap-4">
                  {activePortfolio.auctionEvents.map((event) => (
                    <EventCard
                      key={event.details.auction_id}
                      event={event as unknown as Event}
                      variant="full"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <Card className="p-4">
                <CardTitle>No active portfolio</CardTitle>
                <CardDescription>
                  There are no upcoming auctions scheduled.
                </CardDescription>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="staff" ref={staffRef} className="w-full">
            {isLoadingUserProfile ? (
              <Card className="p-4">
                <CardTitle>Loading upcoming events...</CardTitle>
              </Card>
            ) : (
              <div className="mt-12 grid w-full grid-cols-2 gap-6">
                <StaffHighlightSection
                  title="Upcoming Birthdays"
                  events={upcomingBirthdays}
                  icon={CakeIcon}
                  getEventDescription={(event) =>
                    `Don't forget to wish ${event.first_name} a happy birthday!`
                  }
                />
                <StaffHighlightSection
                  title="Upcoming Work Anniversaries"
                  events={upcomingWorkAnniversaries}
                  icon={BriefcaseIcon}
                  getEventDescription={(event) => {
                    const today = new Date();
                    const startDate = new Date(event.work_anniversary);
                    const yearsOfService = differenceInYears(today, startDate) + 1; // +1 because we're celebrating the upcoming year
                    return `${event.first_name} is going to celebrate ${yearsOfService.toString()} year${yearsOfService > 1 ? 's' : ''} at Burgess Rawson!`;
                  }}
                />
              </div>
            )}
          </TabsContent>
          <TabsContent value="training" ref={trainingRef} className="w-full">
            <h1 className="text-2xl font-semibold">Training Content</h1>
            <p>Training content goes here</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EventsPage;
