"use client";

import React, { useState, useMemo, useEffect } from "react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, CalendarSearch } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createBrowserClient } from "@/utils/supabase/client";
import { EventTypeFilter } from "@/components/molecules/EventTypeFilter/EventTypeFilter";
import { eventTypeInfo } from "@/utils/eventTypeInfo";
import {
  Event,
  PortfolioEvent,
  useUserProfileEvents,
} from "@/components/molecules/CompanyCalendar/CompanyCalendar";
import {
  addHours,
  addDays,
  parseISO,
  format,
  isSameDay,
  isAfter,
  isBefore,
} from "date-fns";
import { CalendarLogic } from "@/components/molecules/CalendarLogic/CalendarLogic";
import { MemoizedEventCalendar } from "@/components/molecules/EventCalendar/EventCalendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventCard } from "@/components/molecules/EventCard/EventCard";
import { StaggeredAnimation } from "@/components/atoms/StaggeredAnimation/StaggeredAnimation";

const allEventTypes = Object.keys(eventTypeInfo).filter(
  (key) => key !== "default",
);

const createEvent = (
  type: keyof typeof eventTypeInfo,
  date: string | null,
  portfolioId: number,
  details: any = null,
  title?: string | null,
): Event | null => {
  if (!date) return null;
  const info = eventTypeInfo[type];
  return {
    type,
    title: title || info.label,
    start_date: date,
    end_date: null,
    portfolio_id: portfolioId,
    details,
  };
};

const createAFREvents = (
  originalDate: string,
  portfolioId: number,
): Event[] => {
  const events: Event[] = [];
  const baseDate = parseISO(originalDate);

  const newEvent = createEvent("afr", originalDate, portfolioId, null, "AFR");
  if (newEvent) events.push(newEvent);

  const anotherEvent = createEvent(
    "afr",
    addHours(baseDate, 24).toISOString(),
    portfolioId,
    null,
    "AFR",
  );
  if (anotherEvent) events.push(anotherEvent);

  const anotherEvent2 = createEvent(
    "afr",
    addDays(baseDate, 7).toISOString(),
    portfolioId,
    null,
    "AFR",
  );
  if (anotherEvent2) events.push(anotherEvent2);

  const anotherEvent3 = createEvent(
    "afr",
    addDays(baseDate, 8).toISOString(),
    portfolioId,
    null,
    "AFR",
  );
  if (anotherEvent3) events.push(anotherEvent3);

  return events;
};

const CalendarPage = () => {
  const currentYear = new Date().getFullYear();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(allEventTypes);
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
    if (!portfolioEvents) return [];

    const allEvents: Event[] = [];

    portfolioEvents.forEach((portfolioEvent) => {
      if (portfolioEvent.auctions) {
        portfolioEvent.auctions.forEach((auction) => {
          const event = createEvent(
            "auction",
            auction.start_date,
            portfolioEvent.portfolio_id,
            auction,
            auction.auction_location + " Auction",
          );
          if (event) allEvents.push(event);
        });
      }

      (Object.keys(eventTypeInfo) as Array<keyof typeof eventTypeInfo>).forEach(
        (eventType) => {
          if (
            eventType !== "auction" &&
            eventType !== "default" &&
            eventType !== "afr" &&
            portfolioEvent[eventType as keyof PortfolioEvent]
          ) {
            const event = createEvent(
              eventType,
              portfolioEvent[eventType as keyof PortfolioEvent] as string,
              portfolioEvent.portfolio_id,
            );
            if (event) allEvents.push(event);
          }
        },
      );

      if (portfolioEvent.afr) {
        const afrEvents = createAFREvents(
          portfolioEvent.afr,
          portfolioEvent.portfolio_id,
        );
        allEvents.push(...afrEvents);
      }

      if (
        portfolioEvent.advertising_period_start &&
        portfolioEvent.advertising_period_end
      ) {
        const event = createEvent(
          "advertising_period",
          portfolioEvent.advertising_period_start,
          portfolioEvent.portfolio_id,
        );
        if (event) {
          allEvents.push({
            ...event,
            end_date: portfolioEvent.advertising_period_end,
          });
        }
      }
    });

    if (userProfileEvents) {
      allEvents.push(...userProfileEvents);
    }

    return allEvents;
  }, [portfolioEvents, userProfileEvents]);

  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    const newFilteredEvents = events.filter((event) =>
      selectedTypes.includes(event.type),
    );
    setFilteredEvents(newFilteredEvents);
  }, [events, selectedTypes]);

  const handleFilterChange = (newSelectedTypes: string[]) => {
    setSelectedTypes(newSelectedTypes);
  };

  const renderMonths = useMemo(() => {
    return (
      <CalendarLogic events={filteredEvents}>
        {(modifiers, modifiersStyles) => (
          <>
            {Array.from({ length: 12 }, (_, i) => {
              const monthDate = new Date(currentYear, i, 1);
              return (
                <div
                  key={i}
                  className="min-w-[250px] flex-shrink-0 flex-grow basis-[calc(25%-1rem)]"
                >
                  <MemoizedEventCalendar
                    events={filteredEvents}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    className="w-full"
                    numberOfMonths={1}
                    defaultMonth={monthDate}
                    enableNavigation={false}
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                  />
                </div>
              );
            })}
          </>
        )}
      </CalendarLogic>
    );
  }, [filteredEvents, currentYear, selectedDate, setSelectedDate]);

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return filteredEvents.filter((event) => {
      const eventStartDate = parseISO(event.start_date);
      const eventEndDate = event.end_date
        ? parseISO(event.end_date)
        : eventStartDate;
      return (
        isSameDay(selectedDate, eventStartDate) ||
        (isAfter(selectedDate, eventStartDate) &&
          isBefore(selectedDate, eventEndDate)) ||
        isSameDay(selectedDate, eventEndDate)
      );
    });
  }, [selectedDate, filteredEvents]);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-4 w-full">
        <div className="sticky top-20">
          <Card className="h-fit w-full rounded-none border-b-0 border-l-0 border-t-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Controls
                <CalendarIcon className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <div className="p-4">
              <EventTypeFilter
                onFilterChange={handleFilterChange}
                initialSelectedTypes={selectedTypes}
              />
              {selectedDate && (
                <div className="mt-4">
                  <CardTitle className="mb-2 flex items-center text-sm">
                    <CalendarSearch className="mr-2 h-4 w-4" />
                    {format(selectedDate, "MMMM d, yyyy")}
                  </CardTitle>
                  <ScrollArea className="h-[400px]">
                    <div className="flex flex-col gap-2">
                      {selectedDateEvents.map((event, index) => (
                        <StaggeredAnimation
                          baseDelay={0}
                          key={event.start_date + selectedDate.toISOString()}
                          index={index}
                        >
                          <EventCard event={event} variant="preview" />
                        </StaggeredAnimation>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      <div className="col-span-8 grid w-full grid-cols-3">
        {isLoadingPortfolioEvents || isLoadingUserProfileEvents ? (
          <div>Loading events...</div>
        ) : portfolioEventsError || userProfileEventsError ? (
          <div>
            Error loading events:{" "}
            {(portfolioEventsError || userProfileEventsError)?.message}
          </div>
        ) : (
          renderMonths
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
