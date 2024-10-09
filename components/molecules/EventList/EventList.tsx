import React, { useMemo } from "react";
import ReactTimeAgo from "react-time-ago";
import {
  format,
  parseISO,
  endOfWeek,
  endOfMonth,
  isSameDay,
  subMonths,
  isAfter,
  startOfDay,
} from "date-fns";
import {
  Event,
  eventColors,
  eventTypePriority,
} from "@/app/(main)/events/dummyEvents";

interface EventListProps {
  selectedDate: Date;
  events: Event[];
}

export function EventList({ selectedDate, events }: EventListProps) {
  const categorizedEvents = useMemo(() => {
    const today: Event[] = [];
    const thisWeek: Event[] = [];
    const thisMonth: Event[] = [];
    const future: Event[] = [];
    const previously: Event[] = [];

    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    const monthEnd = endOfMonth(selectedDate);
    const twoMonthsAgo = subMonths(selectedDate, 2);

    events.forEach((event) => {
      const eventStartDate = parseISO(event.start_date);
      const eventEndDate = event.end_date
        ? parseISO(event.end_date)
        : eventStartDate;

      if (
        (eventStartDate <= selectedDate && eventEndDate >= selectedDate) ||
        isSameDay(eventStartDate, selectedDate)
      ) {
        today.push(event);
      } else if (eventEndDate < selectedDate && eventEndDate >= twoMonthsAgo) {
        previously.push(event);
      } else if (eventStartDate > selectedDate && eventStartDate <= weekEnd) {
        thisWeek.push(event);
      } else if (eventStartDate > weekEnd && eventStartDate <= monthEnd) {
        thisMonth.push(event);
      } else if (eventStartDate > monthEnd) {
        future.push(event);
      }
    });

    const sortEvents = (events: Event[]) =>
      events.sort(
        (a, b) =>
          eventTypePriority[a.event_type] - eventTypePriority[b.event_type],
      );

    return {
      today: sortEvents(today),
      thisWeek: sortEvents(thisWeek),
      thisMonth: sortEvents(thisMonth),
      future: sortEvents(future),
      previously: sortEvents(previously),
    };
  }, [selectedDate, events]);

  const renderEvent = (event: Event) => {
    const eventStartDate = parseISO(event.start_date);
    const eventEndDate = event.end_date ? parseISO(event.end_date) : null;
    const today = startOfDay(new Date());
    const showTimeAgo = isAfter(eventStartDate, today);

    return (
      <div
        key={event.id}
        className="mb-4 animate-slide-down-fade-in rounded-md border p-4"
        style={{ borderColor: eventColors[event.event_type] }}
      >
        <h3 className="font-bold">{event.title}</h3>
        <p>{format(eventStartDate, "MMMM d, yyyy")}</p>
        <p className="text-sm text-gray-500">
          {showTimeAgo ? (
            <>
              Starts{" "}
              <ReactTimeAgo
                date={eventStartDate.getTime()}
                locale="en-US"
                timeStyle="round"
              />
              {eventEndDate && isAfter(eventEndDate, today) && (
                <>
                  {" - Ends "}
                  <ReactTimeAgo
                    date={eventEndDate.getTime()}
                    locale="en-US"
                    timeStyle="round"
                  />
                </>
              )}
            </>
          ) : (
            <>
              {isAfter(eventStartDate, selectedDate) ? "Starts" : "Started"}:{" "}
              {format(eventStartDate, "MMM d, yyyy")}
              {eventEndDate && (
                <>
                  {" - "}
                  {isAfter(eventEndDate, selectedDate) ? "Ends" : "Ended"}:{" "}
                  {format(eventEndDate, "MMM d, yyyy")}
                </>
              )}
            </>
          )}
        </p>
        {event.description && <p>{event.description}</p>}
        {event.location && (
          <p className="text-sm text-gray-600">{event.location}</p>
        )}
        <span
          className="mt-2 inline-block rounded px-2 py-1 text-sm"
          style={{
            backgroundColor: eventColors[event.event_type],
            color: "white",
          }}
        >
          {event.event_type}
        </span>
      </div>
    );
  };

  const renderSection = (title: string, events: Event[]) => {
    return (
      <div key={title + events.length} className="animate-slide-down-fade-in">
        <h2 className="mb-2 text-xl font-bold">{title}</h2>
        {events.length > 0 ? (
          events.map(renderEvent)
        ) : (
          <p className="italic text-gray-500">No events</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {renderSection("Today", categorizedEvents.today)}
      {renderSection("This Week", categorizedEvents.thisWeek)}
      {renderSection("This Month", categorizedEvents.thisMonth)}
      {renderSection("Future", categorizedEvents.future)}
      {renderSection("Previously", categorizedEvents.previously)}
    </div>
  );
}
