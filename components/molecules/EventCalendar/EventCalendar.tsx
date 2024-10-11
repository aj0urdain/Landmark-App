import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { parseISO, startOfDay, format, eachDayOfInterval } from "date-fns";
import { getEventColor, hexToRGBA } from "@/utils/colorUtils";

export type CalendarEvent = {
  type: string;
  start_date: string;
  end_date: string | null;
  details?: any;
};

interface EventCalendarProps {
  events: CalendarEvent[];
  selectedDate?: Date;
  onSelectDate?: (date: Date | undefined) => void;
  className?: string;
}

export function EventCalendar({
  events,
  selectedDate,
  onSelectDate,
  className,
}: EventCalendarProps) {
  const modifiers = React.useMemo(() => {
    const eventMap: Record<string, CalendarEvent[]> = {};

    events.forEach((event) => {
      const startDate = startOfDay(parseISO(event.start_date));
      const endDate = event.end_date
        ? startOfDay(parseISO(event.end_date))
        : startDate;

      if (event.type === "advertising_period") {
        eachDayOfInterval({ start: startDate, end: endDate }).forEach(
          (date) => {
            const dateKey = format(date, "yyyy-MM-dd");
            if (!eventMap[dateKey]) {
              eventMap[dateKey] = [];
            }
            eventMap[dateKey].push(event);
          },
        );
      } else {
        const dateKey = format(startDate, "yyyy-MM-dd");
        if (!eventMap[dateKey]) {
          eventMap[dateKey] = [];
        }
        eventMap[dateKey].push(event);
      }
    });

    const modifiers: Record<string, Date[]> = {};

    Object.entries(eventMap).forEach(([dateKey, dateEvents]) => {
      dateEvents.forEach((event) => {
        if (!modifiers[event.type]) {
          modifiers[event.type] = [];
        }
        modifiers[event.type].push(parseISO(dateKey));
      });
    });

    return modifiers;
  }, [events]);

  const modifiersStyles = React.useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {
      auction: {
        backgroundColor: hexToRGBA("#e74c3c", 0.3),
        borderRadius: "4px",
        color: "white",
      },
      magazine_print: {
        backgroundColor: hexToRGBA("#1890ff", 0.3),
        borderRadius: "4px",
        color: "white",
      },
      signed_schedule: {
        backgroundColor: hexToRGBA("#faad14", 0.3),
        borderRadius: "4px",
        color: "white",
      },
      magazine_deadline: {
        backgroundColor: hexToRGBA("#f5222d", 0.3),
        borderRadius: "4px",
        color: "white",
      },
      advertising_period: {
        backgroundColor: hexToRGBA("#808080", 0.3),
        borderRadius: "0px",
        color: "white",
      },
      selected: {
        fontWeight: "bold",
        border: "2px solid white",
        backgroundColor: "white",
        zIndex: 100,
      },
    };

    events.forEach((event) => {
      if (event.type === "auction" && event.details?.auction_location) {
        const auctionColor = getEventColor(event);
        styles[`auction_${event.details.auction_location}`] = {
          backgroundColor: hexToRGBA(auctionColor, 0.3),
          borderRadius: "4px",
        };
        if (!modifiers[`auction_${event.details.auction_location}`]) {
          modifiers[`auction_${event.details.auction_location}`] = [];
        }
        modifiers[`auction_${event.details.auction_location}`].push(
          parseISO(event.start_date),
        );
      }
    });

    return styles;
  }, [events, modifiers]);

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={onSelectDate}
      className={className}
      modifiers={modifiers}
      modifiersStyles={modifiersStyles}
      numberOfMonths={1}
      showOutsideDays
    />
  );
}
