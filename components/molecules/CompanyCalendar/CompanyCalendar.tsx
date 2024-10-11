import React, { useState, useMemo, useEffect } from "react";
import {
  EventCalendar,
  CalendarEvent,
} from "@/components/molecules/EventCalendar/EventCalendar";
import {
  parseISO,
  format,
  isSameDay,
  isAfter,
  isBefore,
  addYears,
  differenceInYears,
} from "date-fns";

import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import CountUp from "react-countup";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarSearch } from "lucide-react";
import { StaggeredAnimation } from "@/components/atoms/StaggeredAnimation/StaggeredAnimation";
import { createBrowserClient } from "@/utils/supabase/client";

import { EventList } from "@/components/molecules/EventList/EventList";
import { EventCard } from "@/components/molecules/EventCard/EventCard";

import { EventTypeFilter } from "@/components/molecules/EventTypeFilter/EventTypeFilter";

export type Auction = {
  venue: string;
  end_date: string | null;
  portfolio: string;
  auction_id: number;
  start_date: string;
  auction_location: string;
};

export type PortfolioEvent = {
  auctions: Auction[] | null;
  created_at: string;
  portfolio_id: number;
  magazine_print: string | null;
  signed_schedule: string | null;
  magazine_deadline: string | null;
  advertising_period_end: string | null;
  advertising_period_start: string | null;
};

export type Event = {
  type:
    | "auction"
    | "magazine_print"
    | "signed_schedule"
    | "magazine_deadline"
    | "advertising_period"
    | "birthday"
    | "work_anniversary";
  title: string;
  start_date: string;
  end_date: string | null;
  portfolio_id: number;
  details: any;
};

interface UserProfileEvent {
  id: string;
  first_name: string;
  last_name: string;
  birthday: string | null;
  work_anniversary: string | null;
}

const generateRecurringEvents = (
  userEvents: UserProfileEvent[],
  currentYear: number,
) => {
  const recurringEvents = [];
  const today = new Date();

  userEvents.forEach((userEvent) => {
    if (userEvent.birthday) {
      const originalDate = parseISO(userEvent.birthday);
      let eventDate = new Date(
        currentYear,
        originalDate.getMonth(),
        originalDate.getDate(),
      );

      if (isBefore(eventDate, today)) {
        eventDate = addYears(eventDate, 1);
      }

      recurringEvents.push({
        type: "birthday",
        title: `${userEvent.first_name} ${userEvent.last_name}'s Birthday`,
        start_date: eventDate.toISOString(),
        end_date: null,
        portfolio_id: 0,
        details: { ...userEvent, recurring: true },
      });
    }

    if (userEvent.work_anniversary) {
      const originalDate = parseISO(userEvent.work_anniversary);
      let eventDate = new Date(
        currentYear,
        originalDate.getMonth(),
        originalDate.getDate(),
      );

      if (isBefore(eventDate, today)) {
        eventDate = addYears(eventDate, 1);
      }

      recurringEvents.push({
        type: "work_anniversary",
        title: `${userEvent.first_name} ${userEvent.last_name}'s Work Anniversary`,
        start_date: eventDate.toISOString(),
        end_date: null,
        portfolio_id: 0,
        details: { ...userEvent, recurring: true },
      });
    }
  });

  return recurringEvents;
};

export const useUserProfileEvents = () => {
  const supabase = createBrowserClient();
  const currentYear = new Date().getFullYear();

  return useQuery({
    queryKey: ["userProfileEvents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_profile_complete")
        .select("id, first_name, last_name, birthday, work_anniversary")
        .not("birthday", "is", null)
        .not("work_anniversary", "is", null);

      if (error) throw error;
      return generateRecurringEvents(data as UserProfileEvent[], currentYear);
    },
  });
};

const getUniqueEventTypes = (events: Event[]): string[] => {
  const types = events.map((event) => event.type);
  return Array.from(new Set(types));
};

const getEventDetails = (event: Event) => {
  if (event.type === "birthday" || event.type === "work_anniversary") {
    const originalDate = parseISO(
      event.details.birthday || event.details.work_anniversary,
    );
    const years = differenceInYears(new Date(event.start_date), originalDate);

    if (event.type === "birthday") {
      return `Turning ${years} years old`;
    } else {
      return `${years} year${years !== 1 ? "s" : ""} at the company`;
    }
  }

  // Handle other event types...
};

const allEventTypes = [
  "auction",
  "magazine_print",
  "signed_schedule",
  "magazine_deadline",
  "advertising_period",
  "birthday",
  "work_anniversary",
  "training",
];

export function CompanyCalendar() {
  const [date, setDate] = useState<Date>(new Date());
  const supabase = createBrowserClient();

  const {
    data: portfolioEvents,
    isLoading: isLoadingPortfolioEvents,
    error: portfolioEventsError,
  } = useQuery({
    queryKey: ["portfolioEvents"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_all_portfolio_data");
      if (error) throw error;
      return data as PortfolioEvent[];
    },
  });

  const {
    data: userProfileEvents,
    isLoading: isLoadingUserProfileEvents,
    error: userProfileEventsError,
  } = useUserProfileEvents();

  const events = useMemo(() => {
    if (!portfolioEvents && !userProfileEvents) return [];

    const allEvents: Event[] = [];

    if (portfolioEvents) {
      portfolioEvents.forEach((portfolioEvent) => {
        if (portfolioEvent.auctions) {
          portfolioEvent.auctions.forEach((auction) => {
            allEvents.push({
              type: "auction",
              title: `Auction in ${auction.auction_location}`,
              start_date: auction.start_date,
              end_date: auction.end_date,
              portfolio_id: portfolioEvent.portfolio_id,
              details: auction,
            });
          });
        }

        if (portfolioEvent.magazine_print) {
          allEvents.push({
            type: "magazine_print",
            title: "Magazine Print",
            start_date: portfolioEvent.magazine_print,
            end_date: null,
            portfolio_id: portfolioEvent.portfolio_id,
            details: null,
          });
        }

        if (portfolioEvent.signed_schedule) {
          allEvents.push({
            type: "signed_schedule",
            title: "Signed Schedule",
            start_date: portfolioEvent.signed_schedule,
            end_date: null,
            portfolio_id: portfolioEvent.portfolio_id,
            details: null,
          });
        }

        if (portfolioEvent.magazine_deadline) {
          allEvents.push({
            type: "magazine_deadline",
            title: "Magazine Deadline",
            start_date: portfolioEvent.magazine_deadline,
            end_date: null,
            portfolio_id: portfolioEvent.portfolio_id,
            details: null,
          });
        }

        if (
          portfolioEvent.advertising_period_start &&
          portfolioEvent.advertising_period_end
        ) {
          allEvents.push({
            type: "advertising_period",
            title: "Advertising Period",
            start_date: portfolioEvent.advertising_period_start,
            end_date: portfolioEvent.advertising_period_end,
            portfolio_id: portfolioEvent.portfolio_id,
            details: null,
          });
        }
      });
    }

    if (userProfileEvents) {
      allEvents.push(...userProfileEvents);
    }

    return allEvents;
  }, [portfolioEvents, userProfileEvents]);

  const currentPortfolio = useMemo(() => {
    if (!events.length) {
      console.log("No events found");
      return null;
    }

    const today = new Date();
    console.log("Today's date:", today);
    let activePortfolio = null;

    // First, check if today is an auction day
    const auctionToday = events.find(
      (event) =>
        event.type === "auction" &&
        isSameDay(parseISO(event.start_date), today),
    );

    if (auctionToday) {
      console.log("Auction today found:", auctionToday);
      return auctionToday.portfolio_id;
    }

    // If not an auction day, find the portfolio we're currently in
    const relevantEvents = events.filter(
      (event) => event.type === "magazine_deadline" || event.type === "auction",
    );
    relevantEvents.sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
    );

    console.log("Relevant sorted events:", relevantEvents);

    for (let i = 0; i < relevantEvents.length - 1; i++) {
      const currentEvent = relevantEvents[i];
      const nextEvent = relevantEvents[i + 1];

      console.log("Checking events:", currentEvent, nextEvent);

      if (
        isAfter(today, parseISO(currentEvent.start_date)) &&
        isBefore(today, parseISO(nextEvent.start_date))
      ) {
        activePortfolio = currentEvent.portfolio_id;
        console.log("Active portfolio found:", activePortfolio);
        break;
      }
    }

    if (!activePortfolio) {
      console.log("No active portfolio found");
    }

    return activePortfolio;
  }, [events]);

  const calendarEvents: CalendarEvent[] = events.map((event) => ({
    type: event.type,
    start_date: event.start_date,
    end_date: event.end_date,
    details: event.details,
  }));

  const eventTypes = useMemo(() => getUniqueEventTypes(events), [events]);

  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(allEventTypes);

  useEffect(() => {
    const newFilteredEvents = events.filter((event) =>
      selectedTypes.includes(event.type),
    );
    setFilteredEvents(newFilteredEvents);
  }, [events, selectedTypes]);

  const handleFilterChange = (newSelectedTypes: string[]) => {
    setSelectedTypes(newSelectedTypes);
  };

  return (
    <div className="flex h-full w-full flex-col space-y-4">
      {isLoadingPortfolioEvents || isLoadingUserProfileEvents ? (
        <div>Loading events...</div>
      ) : portfolioEventsError || userProfileEventsError ? (
        <div>
          Error loading events:{" "}
          {(portfolioEventsError || userProfileEventsError)?.message}
        </div>
      ) : (
        <>
          <div className="flex h-80 gap-2">
            <div className="flex w-full flex-col items-center justify-center gap-4">
              {format(new Date(), "MMMM d, yyyy")}
              <div className="flex w-full items-center justify-center gap-12">
                <div className="flex animate-slide-left-fade-in flex-col items-center justify-center gap-1.5 opacity-0 [animation-duration:_2s] [animation-fill-mode:_forwards]">
                  <h1 className="flex items-start gap-1 text-7xl font-bold">
                    <span className="mt-1 text-2xl text-muted-foreground">
                      #
                    </span>
                    <CountUp
                      start={0}
                      end={currentPortfolio || 0}
                      duration={3}
                      useEasing
                    />
                  </h1>
                  <Label className="animate-slide-up-fade-in text-muted-foreground opacity-0 [animation-delay:_2.5s] [animation-duration:_2s] [animation-fill-mode:_forwards]">
                    Current Portfolio
                  </Label>
                </div>
                <div className="flex animate-slide-right-fade-in flex-col items-center justify-center gap-1.5 opacity-0 [animation-duration:_2s] [animation-fill-mode:_forwards]">
                  <h1 className="flex items-start gap-1 text-7xl font-bold">
                    <CountUp start={100} end={27} duration={3} useEasing />
                  </h1>
                  <Label className="animate-slide-up-fade-in text-muted-foreground opacity-0 [animation-delay:_2.5s] [animation-duration:_2s] [animation-fill-mode:_forwards]">
                    Days Until Auction
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex h-full items-start justify-center">
              <EventCalendar
                events={calendarEvents}
                selectedDate={date}
                onSelectDate={(newDate) => setDate(newDate || new Date())}
                className=""
              />
              <div className="flex h-full items-center justify-center">
                <Separator orientation="vertical" className="mx-2 h-1/2" />
              </div>
              <Card className="flex h-full w-[20rem] flex-col space-y-2 border-0 px-4">
                <CardHeader className="flex h-12 flex-shrink-0 items-center justify-center">
                  <CardTitle
                    key={date.toISOString()}
                    className="flex animate-slide-left-fade-in items-center text-sm"
                  >
                    <CalendarSearch className="mr-2 h-4 w-4" />
                    {format(date, "MMMM d, yyyy")}
                  </CardTitle>
                </CardHeader>
                <ScrollArea className="h-full">
                  <div className="flex h-full flex-col gap-2">
                    {events
                      ?.filter((event) => {
                        const eventStartDate = parseISO(event.start_date);
                        const eventEndDate = event.end_date
                          ? parseISO(event.end_date)
                          : eventStartDate;
                        return (
                          isSameDay(date, eventStartDate) ||
                          (isAfter(date, eventStartDate) &&
                            isBefore(date, eventEndDate)) ||
                          isSameDay(date, eventEndDate)
                        );
                      })
                      .map((event, index) => (
                        <StaggeredAnimation
                          baseDelay={0}
                          key={event.start_date + date.toISOString()}
                          index={index}
                        >
                          <EventCard event={event} variant="preview" />
                        </StaggeredAnimation>
                      ))}
                  </div>
                </ScrollArea>
              </Card>
            </div>
          </div>

          <EventTypeFilter
            onFilterChange={handleFilterChange}
            initialSelectedTypes={selectedTypes}
          />
          <EventList events={filteredEvents} />
        </>
      )}
    </div>
  );
}