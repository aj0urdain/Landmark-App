import React, { useMemo } from 'react';
import { parseISO, startOfDay, format, eachDayOfInterval } from 'date-fns';
import { eventTypeInfo, getEventColor, hexToRGBA } from '@/utils/eventTypeInfo';
import { CalendarEvent } from '../EventCalendar/EventCalendar';

export type Event = {
  type: keyof typeof eventTypeInfo;
  title: string;
  start_date: string;
  end_date: string | null;
  portfolio_id: number;
  details: unknown;
};

interface CalendarLogicProps {
  events: CalendarEvent[];
  children: (
    modifiers: Record<string, Date[]>,
    modifiersStyles: Record<string, React.CSSProperties>,
  ) => React.ReactNode;
}

export function CalendarLogic({ events, children }: CalendarLogicProps) {
  const modifiers = useMemo(() => {
    const eventMap: Record<string, CalendarEvent[]> = {};

    events.forEach((event) => {
      const startDate = startOfDay(parseISO(event.start_date));
      const endDate = event.end_date ? startOfDay(parseISO(event.end_date)) : startDate;

      if (event.type === 'advertising_period') {
        eachDayOfInterval({ start: startDate, end: endDate }).forEach((date) => {
          const dateKey = format(date, 'yyyy-MM-dd');
          if (!eventMap[dateKey]) {
            eventMap[dateKey] = [];
          }
          eventMap[dateKey].push(event);
        });
      } else {
        const dateKey = format(startDate, 'yyyy-MM-dd');
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

  const modifiersStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    events.forEach((event) => {
      const { bgColor, borderColor } = getEventColor(event as Event);

      styles[event.type] = {
        backgroundColor: hexToRGBA(bgColor, 0.3),
        borderRadius: '0px',
        color: 'hsl(var(--foreground))',
      };

      if (event.type === 'birthday') {
        styles[event.type] = {
          ...styles[event.type],
          backgroundColor: 'transparent',
          color: hexToRGBA(bgColor, 1),
          fontWeight: 'bold',
        };
      }

      if (event.type === 'work_anniversary') {
        styles[event.type] = {
          ...styles[event.type],
          backgroundColor: 'transparent',
          color: hexToRGBA(bgColor, 1),
          fontWeight: 'bold',
        };
      }

      if (event.type === 'signed_schedule' && borderColor) {
        styles[event.type] = {
          ...styles[event.type],
          backgroundColor: 'transparent',
          border: `2px dotted ${hexToRGBA(borderColor || '#000', 0.3)}`,
          borderRadius: '2px',
          borderColor: borderColor,
        };
      }

      if (event.type === 'magazine_deadline') {
        styles[event.type] = {
          ...styles[event.type],
          backgroundColor: hexToRGBA(bgColor, 0.15),
          border: `2px dotted ${hexToRGBA(borderColor || '#000', 0.3)}`,
          borderRadius: '2px',
          borderColor: borderColor,
        };
      }

      if (event.type === 'magazine_print') {
        styles[event.type] = {
          ...styles[event.type],
          backgroundColor: hexToRGBA(bgColor, 0.2),
        };
      }

      if (event.type === 'advertising_period') {
        styles[event.type] = {
          ...styles[event.type],
          backgroundColor: hexToRGBA(bgColor, 0.15),
        };
      }

      if (event.type === 'auction' && event.details?.auction_location) {
        const location = event.details.auction_location as string;
        styles[`auction_${location}`] = {
          backgroundColor: hexToRGBA(bgColor, 0.3),
          borderRadius: '4px',
          color: 'hsl(var(--foreground))',
        };
        if (!modifiers[`auction_${location}`]) {
          modifiers[`auction_${location}`] = [];
        }
        modifiers[`auction_${location}`].push(parseISO(event.start_date));
      }
    });

    styles.selected = {
      fontWeight: 'bold',
      border: '2px solid white',
      backgroundColor: 'white',
      animation: 'pulse 2s infinite',
      zIndex: 100,
    };

    return styles;
  }, [events, modifiers]);

  return <>{children(modifiers, modifiersStyles)}</>;
}
