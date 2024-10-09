import React, { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { parseISO, format, isSameDay, startOfDay } from "date-fns";
import { EventList } from "@/components/molecules/EventList/EventList";
import {
  eventColors,
  events,
  eventTypePriority,
  Event,
} from "@/app/(main)/events/dummyEvents";
import { useQuery } from "@tanstack/react-query";

export function CompanyCalendar() {
  const [date, setDate] = useState<Date>(new Date());

  const { data: eventsData } = useQuery({
    queryKey: ["events"],
    queryFn: () => events, // In a real app, this would be an API call
    staleTime: Infinity, // Since our data is static, we don't need to refetch
  });

  const getHighestPriorityEvent = (events: Event[]): Event => {
    return events.reduce((highest, current) =>
      eventTypePriority[current.event_type] <
      eventTypePriority[highest.event_type]
        ? current
        : highest,
    );
  };

  const modifiers = useMemo(() => {
    if (!eventsData) return {};

    const eventMap: Record<string, Event[]> = {};

    eventsData.forEach((event) => {
      const startDate = startOfDay(parseISO(event.start_date));
      const endDate = event.end_date
        ? startOfDay(parseISO(event.end_date))
        : startDate;

      // Ensure single-day events are treated as such
      if (event.event_span === "single" || isSameDay(startDate, endDate)) {
        const dateKey = format(startDate, "yyyy-MM-dd");
        if (!eventMap[dateKey]) {
          eventMap[dateKey] = [];
        }
        eventMap[dateKey].push(event);
      } else {
        let currentDate = startDate;
        while (currentDate <= endDate) {
          const dateKey = format(currentDate, "yyyy-MM-dd");
          if (!eventMap[dateKey]) {
            eventMap[dateKey] = [];
          }
          eventMap[dateKey].push(event);
          currentDate = new Date(
            currentDate.setDate(currentDate.getDate() + 1),
          );
        }
      }
    });

    const highestPriorityEvents: Record<string, Date[]> = {};

    Object.entries(eventMap).forEach(([dateKey, dateEvents]) => {
      const highestPriorityEvent = getHighestPriorityEvent(dateEvents);
      if (!highestPriorityEvents[highestPriorityEvent.event_type]) {
        highestPriorityEvents[highestPriorityEvent.event_type] = [];
      }
      highestPriorityEvents[highestPriorityEvent.event_type].push(
        parseISO(dateKey),
      );
    });

    return highestPriorityEvents;
  }, [eventsData]);

  const modifiersStyles = {
    ...Object.entries(eventColors).reduce(
      (acc, [eventType, color]) => ({
        ...acc,
        [eventType]: {
          backgroundColor: color,
          color: "white",
          fontWeight: "bold",
          opacity: 1,
          borderRadius: (day: Date) => {
            const event = eventsData?.find(
              (e) =>
                e.event_type === eventType &&
                isSameDay(parseISO(e.start_date), day),
            );
            return event?.event_span === "single" || !event?.end_date
              ? undefined
              : 0;
          },
        },
      }),
      {},
    ),
    selected: {
      border: "2px solid white",
      fontWeight: "bold",
    },
  };

  return (
    <div className="flex flex-col space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => setDate(newDate || new Date())}
        className="rounded-md border"
        modifiers={{ ...modifiers, selected: [date] }}
        modifiersStyles={modifiersStyles}
        numberOfMonths={2}
        required
        fixedWeeks
      />
      <EventList selectedDate={date} events={eventsData || []} />
    </div>
  );
}
