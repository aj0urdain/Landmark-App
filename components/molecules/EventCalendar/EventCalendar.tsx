import React from "react";
import { Calendar } from "@/components/ui/calendar";

export type CalendarEvent = {
  type: string;
  start_date: string;
  end_date: string | null;
  details?: Record<string, unknown>;
  title?: string;
  portfolio_id?: number;
};

interface EventCalendarProps {
  events: CalendarEvent[];
  selectedDate?: Date;
  onSelectDate?: (date: Date | undefined) => void;
  className?: string;
  numberOfMonths?: number;
  enableNavigation?: boolean;
  defaultMonth?: Date;
  modifiers: Record<string, Date[]>;
  modifiersStyles: Record<string, React.CSSProperties>;
  classNames?: Record<string, string>;
  month?: Date;
  onMonthChange?: (date: Date | undefined) => void;
  showWeekNumbers?: boolean;
}

export function EventCalendar({
  selectedDate,
  onSelectDate,
  className,
  numberOfMonths = 1,
  enableNavigation = true,
  defaultMonth,
  modifiers,
  modifiersStyles,
  classNames = {},
  month,
  onMonthChange,
  showWeekNumbers,
}: EventCalendarProps) {
  return (
    <Calendar
      mode="single"
      defaultMonth={defaultMonth}
      selected={selectedDate}
      month={month}
      onMonthChange={onMonthChange}
      onSelect={onSelectDate}
      className={className}
      modifiers={modifiers}
      modifiersStyles={modifiersStyles}
      numberOfMonths={numberOfMonths}
      showOutsideDays
      enableNavigation={enableNavigation}
      classNames={classNames}
      showWeekNumber={showWeekNumbers}
    />
  );
}

export const MemoizedEventCalendar = React.memo(EventCalendar);
