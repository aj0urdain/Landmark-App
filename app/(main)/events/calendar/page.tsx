'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { EventTypeFilter } from '@/components/molecules/EventTypeFilter/EventTypeFilter';
import { eventTypeInfo } from '@/utils/eventTypeInfo';
import { Event } from '@/utils/getCalendarEvents';
import { format, isSameDay, isAfter, isBefore, parseISO } from 'date-fns';
import { CalendarLogic } from '@/components/molecules/CalendarLogic/CalendarLogic';
import {
  CalendarEvent,
  MemoizedEventCalendar,
} from '@/components/molecules/EventCalendar/EventCalendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EventCard } from '@/components/molecules/EventCard/EventCard';
import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCalendarEvents } from '@/utils/getCalendarEvents';

const allEventTypes = Object.keys(eventTypeInfo).filter((key) => key !== 'default');

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const currentYear = selectedDate
    ? selectedDate.getFullYear()
    : new Date().getFullYear();
  const currentMonth = selectedDate ? selectedDate.getMonth() : new Date().getMonth();
  const [highlightState, setHighlightState] = useState<'inactive' | 'active' | 'fading'>(
    'inactive',
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>([...allEventTypes]);
  const currentMonthRef = useRef<HTMLDivElement>(null);

  const handleYearChange = (increment: number) => {
    const newDate = new Date(selectedDate ?? new Date());
    newDate.setFullYear(newDate.getFullYear() + increment);
    setSelectedDate(newDate);
    if (currentMonthRef.current) {
      currentMonthRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleDayChange = (increment: number) => {
    const newDate = new Date(selectedDate ?? new Date());
    newDate.setDate(newDate.getDate() + increment);
    setSelectedDate(newDate);
  };

  const {
    data: events,
    isLoading: isLoadingEvents,
    error: eventsError,
  } = useCalendarEvents();

  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (events) {
      const newFilteredEvents = events.filter((event) =>
        selectedTypes.includes(event.type),
      );
      console.log('Filtered Events:', newFilteredEvents);
      setFilteredEvents(newFilteredEvents);
    }
  }, [events, selectedTypes]);

  const handleFilterChange = (newSelectedTypes: string[]) => {
    setSelectedTypes(newSelectedTypes);
  };

  useEffect(() => {
    if (currentMonthRef.current && !isLoadingEvents) {
      currentMonthRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setHighlightState('active');
      setTimeout(() => {
        setHighlightState('fading');
      }, 2000);
      setTimeout(() => {
        setHighlightState('inactive');
      }, 2500);
    }
  }, [isLoadingEvents]);

  const renderCalendarMonths = useMemo(() => {
    return (
      <CalendarLogic events={filteredEvents as CalendarEvent[]}>
        {(modifiers, modifiersStyles) => (
          <>
            {Array.from({ length: 12 }, (_, i) => {
              const monthDate = new Date(currentYear, i, 1);
              const isCurrentMonth = i === currentMonth;
              const customClassNames = {
                caption_label: isCurrentMonth
                  ? highlightState !== 'inactive'
                    ? 'text-warning-foreground text-sm font-medium transition-colors duration-500'
                    : 'text-foreground text-sm font-medium transition-colors duration-500'
                  : 'text-sm font-medium text-muted-foreground/50 transition-colors duration-500',
              };

              return (
                <StaggeredAnimation baseDelay={0} incrementDelay={0.1} key={i} index={i}>
                  <div
                    className={cn(
                      'duration-2000 flex-shrink-0 flex-grow transition-all ease-in-out',
                      isCurrentMonth && highlightState === 'active' && 'scale-110',
                      isCurrentMonth && highlightState === 'fading' && 'scale-100',
                      isLoadingEvents ? 'opacity-40' : '',
                    )}
                    ref={isCurrentMonth ? currentMonthRef : null}
                  >
                    <MemoizedEventCalendar
                      events={isLoadingEvents ? [] : (filteredEvents as CalendarEvent[])}
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                      className="w-fit"
                      numberOfMonths={1}
                      defaultMonth={monthDate}
                      enableNavigation={false}
                      modifiers={modifiers}
                      modifiersStyles={modifiersStyles}
                      classNames={customClassNames}
                    />
                  </div>
                </StaggeredAnimation>
              );
            })}
          </>
        )}
      </CalendarLogic>
    );
  }, [
    filteredEvents,
    currentYear,
    currentMonth,
    highlightState,
    selectedDate,
    setSelectedDate,
    isLoadingEvents,
  ]);

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    const filteredDateEvents = filteredEvents.filter((event) => {
      const eventStartDate = parseISO(event.start_date);
      const eventEndDate = event.end_date ? parseISO(event.end_date) : eventStartDate;

      return (
        isSameDay(selectedDate, eventStartDate) ||
        (isAfter(selectedDate, eventStartDate) && isBefore(selectedDate, eventEndDate)) ||
        isSameDay(selectedDate, eventEndDate)
      );
    });

    console.log('Selected Date Events:', filteredDateEvents);
    return filteredDateEvents;
  }, [selectedDate, filteredEvents]);

  const eventsKey = selectedDate ? selectedDate.toISOString() : 'no-date';

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 w-full md:col-span-4">
          <div className="sticky top-24">
            <Card className="h-full min-h-[400px] w-full bg-muted/10 hover:border-foreground/20 transition-all duration-300">
              <CardTitle className="flex flex-col items-start justify-start gap-6 p-6 text-lg">
                <EventTypeFilter
                  onFilterChange={handleFilterChange}
                  initialSelectedTypes={selectedTypes}
                />
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-muted-foreground">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-5 p-0"
                        onClick={() => {
                          handleYearChange(-1);
                        }}
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-5 p-0"
                        onClick={() => {
                          handleYearChange(1);
                        }}
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {selectedDate ? format(selectedDate, 'yyyy') : 'Select a date'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-muted-foreground">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-5 p-0"
                        onClick={() => {
                          handleDayChange(-1);
                        }}
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-5 p-0"
                        onClick={() => {
                          handleDayChange(1);
                        }}
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                    {selectedDate ? format(selectedDate, 'MMMM d') : 'Select a date'}
                  </div>
                </div>
              </CardTitle>
              <CardContent>
                {selectedDate && (
                  <div className="">
                    <ScrollArea className="min-h-[400px]">
                      <div className="flex flex-col gap-2" key={eventsKey}>
                        {selectedDateEvents.length > 0 ? (
                          selectedDateEvents.map((event, index) => (
                            <StaggeredAnimation
                              baseDelay={0}
                              key={event.start_date + eventsKey + String(index)}
                              index={index}
                            >
                              <EventCard
                                key={event.start_date + eventsKey + String(index)}
                                event={event}
                                variant="preview"
                              />
                            </StaggeredAnimation>
                          ))
                        ) : (
                          <p
                            key={selectedDate.toISOString()}
                            className="animate-slide-down-fade-in text-sm text-muted-foreground"
                          >
                            No events listed for {format(selectedDate, 'MMMM d, yyyy')}.
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="col-span-6 w-full md:col-span-8">
          {eventsError ? (
            <div>
              <p className="text-center text-red-500">
                Error loading events: {eventsError.message}
              </p>
              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {renderCalendarMonths}
              </div>
            </div>
          ) : (
            <div
              key={currentYear}
              className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {renderCalendarMonths}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
