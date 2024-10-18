import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { format } from 'date-fns';
import { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { AnimatedBackground } from '@/components/atoms/AnimatedBackground/AnimatedBackground';
import { getEventColor } from '@/utils/eventTypeInfo';
import Link from 'next/link';

interface Event {
  id: string;
  first_name: string;
  last_name: string;
  nextOccurrence: Date;
  profile_picture?: string;
  event_type: string;
  work_anniversary: string;
}

interface StaffHighlightSectionProps {
  title: string;
  events: Event[];
  icon: LucideIcon;
  getEventDescription: (event: Event) => string;
}

export const StaffHighlightSection: React.FC<StaffHighlightSectionProps> = ({
  title,
  events,
  icon: Icon,
  getEventDescription,
}) => {
  return (
    <div className="space-y-4">
      <Label className="ml-4 flex items-center gap-2 font-semibold text-muted-foreground">
        <Icon className="h-4 w-4" />
        {title}
      </Label>
      <div className="grid grid-cols-2 gap-4">
        {events.map((event, index) => {
          const { gradientBgColors } = getEventColor(event);
          return (
            <AnimatedBackground
              colors={gradientBgColors}
              className={`${index === 0 ? 'col-span-2' : ''} rounded-xl`}
              active={index === 0}
            >
              <Link href={`/wiki/people/${event.first_name}-${event.last_name}`}>
                <Card
                  key={event.id}
                  className={`${index === 0 ? 'col-span-2 min-h-48' : 'max-h-20'} relative rounded-lg bg-card/85`}
                >
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`flex flex-col ${index === 0 ? 'gap-2' : 'gap-1'}`}>
                      <CardTitle
                        className={`flex items-center ${index === 0 ? 'gap-2 text-4xl' : 'gap-1'}`}
                      >
                        <p className="font-light">{event.first_name}</p>
                        <p className="font-bold">{event.last_name}</p>
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center justify-start gap-2">
                          <Icon className={index === 0 ? 'h-4 w-4' : 'h-3 w-3'} />
                          <p
                            className={
                              index === 0 ? 'text-base font-semibold' : 'text-sm'
                            }
                          >
                            {index === 0
                              ? format(event.nextOccurrence, 'MMMM d')
                              : format(event.nextOccurrence, 'MMM d')}
                          </p>
                        </div>
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="flex w-3/5 max-h-full items-center">
                    {index === 0 && (
                      <p className="text-sm text-muted-foreground">
                        {getEventDescription(event)}
                      </p>
                    )}
                    <Image
                      src={event.profile_picture ?? ''}
                      alt={`${event.first_name} ${event.last_name}`}
                      width={100}
                      height={100}
                      className="absolute right-6 top-0 h-full w-auto"
                    />
                  </CardContent>
                </Card>
              </Link>
            </AnimatedBackground>
          );
        })}
      </div>
    </div>
  );
};
