import React, { useMemo } from "react";
import {
  parseISO,
  endOfWeek,
  endOfMonth,
  isSameDay,
  subMonths,
  compareAsc,
} from "date-fns";
import { Event } from "../CompanyCalendar/CompanyCalendar";
import { EventCard } from "@/components/molecules/EventCard/EventCard";

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  const categorizedEvents = useMemo(() => {
    const today = new Date();

    const todayEvents: Event[] = [];
    const thisWeekEvents: Event[] = [];
    const thisMonthEvents: Event[] = [];
    const futureEvents: Event[] = [];
    const previousEvents: Event[] = [];

    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const monthEnd = endOfMonth(today);
    const twoMonthsAgo = subMonths(today, 2);

    // Sort all events by start date
    const sortedEvents = events.sort((a, b) =>
      compareAsc(parseISO(a.start_date), parseISO(b.start_date)),
    );

    sortedEvents.forEach((event) => {
      const eventStartDate = parseISO(event.start_date);
      const eventEndDate = event.end_date
        ? parseISO(event.end_date)
        : eventStartDate;

      if (
        (eventStartDate <= today && eventEndDate >= today) ||
        isSameDay(eventStartDate, today)
      ) {
        todayEvents.push(event);
      } else if (eventEndDate < today && eventEndDate >= twoMonthsAgo) {
        previousEvents.push(event);
      } else if (eventStartDate > today && eventStartDate <= weekEnd) {
        thisWeekEvents.push(event);
      } else if (eventStartDate > weekEnd && eventStartDate <= monthEnd) {
        thisMonthEvents.push(event);
      } else if (eventStartDate > monthEnd) {
        futureEvents.push(event);
      }
    });

    return {
      today: todayEvents,
      thisWeek: thisWeekEvents,
      thisMonth: thisMonthEvents,
      future: futureEvents,
      previously: previousEvents,
    };
  }, [events]);

  const renderColumn = (title: string, events: Event[]) => (
    <div key={title} className="mb-8">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={`${event.type}-${event.portfolio_id}-${event.start_date}`}
              event={event}
              variant="full"
            />
          ))}
        </div>
      ) : (
        <p className="italic text-gray-500">No events</p>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {renderColumn("Today", categorizedEvents.today)}
      {renderColumn("This Week", categorizedEvents.thisWeek)}
      {renderColumn("This Month", categorizedEvents.thisMonth)}
      {renderColumn("Future", categorizedEvents.future)}
      {renderColumn("Previously", categorizedEvents.previously)}
    </div>
  );
}
