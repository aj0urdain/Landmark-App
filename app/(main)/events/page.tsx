"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import React, { useState, useMemo } from "react";
import {
  addDays,
  startOfWeek,
  endOfWeek,
  format,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { Separator } from "@/components/ui/separator";
import { StaggeredAnimation } from "@/components/atoms/StaggeredAnimation/StaggeredAnimation";
import { CalendarIcon } from "lucide-react";

const EventsPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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
    } else {
      // If date is undefined (user trying to unselect), keep the current week
      setSelectedDate(new Date());
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
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
              className={`relative h-16 animate-slide-down-fade-in cursor-pointer p-2 transition-all ${
                isSameDay(day, selectedDate)
                  ? "bg-primary"
                  : "hover:bg-primary/5"
              }`}
              onClick={() => handleDateSelect(day)}
            >
              <div
                className={`text-xs font-semibold ${
                  isSameDay(day, selectedDate)
                    ? "text-secondary"
                    : "text-muted-foreground/75"
                }`}
              >
                {format(day, "EEEE")}
              </div>
              <div
                className={`absolute bottom-1 right-2 flex items-center justify-center text-4xl font-semibold ${
                  isSameDay(day, selectedDate) ? "text-secondary" : "text-muted"
                }`}
              >
                {format(day, "d")}
              </div>
            </Card>
          </StaggeredAnimation>
        ))}
      </div>
      <Separator className="my-3 w-1/6" />
      <div className="flex w-full justify-center gap-6">
        <div className="w-full">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {format(selectedDate, "MMMM d")}
          </CardTitle>
          <CardContent className="mt-4 grid grid-cols-2 gap-4 p-0">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card className="p-4" key={index}>
                <CardTitle>Event {index}</CardTitle>
                <CardDescription>Event description</CardDescription>
              </Card>
            ))}
            <Card className="border border-warning-foreground p-4">
              <CardTitle>Create Event</CardTitle>
              <CardDescription>Create a new event</CardDescription>
            </Card>
          </CardContent>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          modifiers={{
            selected: selectedDate,
            "in-selected-week": (date) =>
              isWithinInterval(date, {
                start: selectedWeek.from,
                end: selectedWeek.to,
              }),
          }}
          modifiersStyles={{
            selected: {
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--foreground))",
            },
            "in-selected-week": {
              backgroundColor: "hsl(var(--primary) / 0.1)",
              borderRadius: "0px",
              color: "hsl(var(--foreground))",
            },
          }}
        />
      </div>
      <Separator className="my-12 w-full" />
      <div className="grid w-full grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>{index}</Card>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
