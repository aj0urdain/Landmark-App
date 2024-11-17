import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { CakeIcon, BriefcaseIcon, Cake } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { differenceInDays, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import BirthdayConfetti from '../BirthdayConfetti/BirthdayConfetti';

const getUpcomingEvents = (data: any[], eventType: string, limit = 3) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();

  return data
    .map((user: any) => {
      const date = new Date(user[eventType]);
      let nextOccurrence = new Date(currentYear, date.getMonth(), date.getDate());

      if (nextOccurrence < today) {
        nextOccurrence = new Date(currentYear + 1, date.getMonth(), date.getDate());
      }

      const daysUntil = differenceInDays(nextOccurrence, today);
      const isTodayEvent = isSameDay(nextOccurrence, today);

      return { ...user, nextOccurrence, daysUntil, isTodayEvent };
    })
    .sort((a, b) => {
      if (a.isTodayEvent && !b.isTodayEvent) return -1;
      if (!a.isTodayEvent && b.isTodayEvent) return 1;

      return a.nextOccurrence.getTime() - b.nextOccurrence.getTime();
    })
    .slice(0, limit);
};

const GenericDepartmentStaffEventsCard = ({
  departmentID,
  departmentName,
}: {
  departmentID: number;
  departmentName: string;
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'birthdays' | 'anniversaries'>('birthdays');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isHovered, setIsHovered] = useState(false);
  const supabase = createBrowserClient();
  const cardRef = useRef<HTMLDivElement>(null);

  const { data: staffEvents, isLoading: isLoadingStaffEvents } = useQuery({
    queryKey: ['staff-events', departmentID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profile_complete')
        .select('id, first_name, last_name, birthday, work_anniversary, profile_picture')
        .contains('department_ids', [departmentID])
        .not('birthday', 'is', null)
        .not('work_anniversary', 'is', null);

      if (error) {
        console.error('Error fetching staff events:', error);
        return { birthdays: [], workAnniversaries: [] };
      }

      return {
        birthdays: getUpcomingEvents(data, 'birthday'),
        workAnniversaries: getUpcomingEvents(data, 'work_anniversary'),
      };
    },
  });

  // Auto-rotate every 5 seconds if not hovering
  useEffect(() => {
    if (!staffEvents || isHovered) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setCurrentIndex(
            (prev) =>
              (prev + 1) %
              staffEvents[activeTab === 'birthdays' ? 'birthdays' : 'workAnniversaries']
                .length,
          );
          return 5; // Reset timer
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [staffEvents, activeTab, isHovered]);

  // Reset index when switching tabs
  useEffect(() => {
    setCurrentIndex(0);
    setTimeLeft(5);
  }, [activeTab]);

  if (isLoadingStaffEvents) return <p>Loading events...</p>;

  const currentEvent =
    staffEvents?.[activeTab === 'birthdays' ? 'birthdays' : 'workAnniversaries']?.[
      currentIndex
    ];

  const handleCardClick = () => {
    if (currentEvent) {
      router.push(`/wiki/people/${currentEvent.first_name}-${currentEvent.last_name}`);
    }
  };

  const handleButtonClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setCurrentIndex(idx);
    setTimeLeft(5);
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab(activeTab === 'birthdays' ? 'anniversaries' : 'birthdays');
  };

  return (
    <>
      {currentEvent?.isTodayEvent && activeTab === 'birthdays' && isHovered && (
        <BirthdayConfetti />
      )}

      <Card
        ref={cardRef}
        className={cn(
          'row-span-1 flex h-1/2 flex-col relative p-4 cursor-pointer overflow-hidden transition-colors',
          isHovered && activeTab === 'birthdays' && 'border-pink-500/50',
          isHovered && activeTab === 'anniversaries' && 'border-orange-500/50',
        )}
        onClick={handleCardClick}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header section with fixed height */}
          <div className="h-12 flex items-center gap-3">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleToggleClick}
                    className="hover:bg-background hover:border-muted-foreground relative z-50"
                  >
                    {timeLeft && !isHovered && (
                      <div className="absolute -top-2 -right-2 bg-muted text-foreground-muted rounded-full w-4 h-4 flex items-center justify-center text-[8px]">
                        {timeLeft}
                      </div>
                    )}
                    {activeTab === 'birthdays' ? (
                      <CakeIcon className="h-4 w-4 animate-slide-down-fade-in text-pink-500" />
                    ) : (
                      <BriefcaseIcon className="h-4 w-4 animate-slide-up-fade-in text-orange-500" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="text-xs z-50 flex gap-1 bg-background text-foreground"
                  side="right"
                >
                  <p>
                    Switch to{' '}
                    <span className="font-bold">
                      {activeTab === 'birthdays' ? 'Work Anniversaries' : 'Birthdays'}
                    </span>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p
              className={cn(
                'text-xs text-muted-foreground font-bold animate-slide-left-fade-in',
                activeTab === 'birthdays' && 'text-pink-300/75',
                activeTab === 'anniversaries' && 'text-orange-300/75',
              )}
            >
              Upcoming Staff{' '}
              {activeTab === 'birthdays' ? 'Birthdays' : 'Work Anniversaries'}
            </p>
          </div>

          {/* Main content with fixed layout */}
          <div className="flex-1 flex gap-2 mt-4">
            {/* Navigation buttons in fixed width column */}
            <div className="w-10 flex flex-col gap-2">
              {staffEvents?.[
                activeTab === 'birthdays' ? 'birthdays' : 'workAnniversaries'
              ]?.map((event, idx) => (
                <Button
                  key={String(event.id)}
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleButtonClick(e, idx)}
                  className={cn(
                    'h-8 w-8 p-0 relative rounded-full',
                    currentIndex === idx
                      ? 'ring-1 ring-muted-foreground'
                      : 'opacity-50 hover:opacity-100',
                  )}
                >
                  {event.profile_picture ? (
                    <Image
                      src={event.profile_picture}
                      alt={`${event.first_name} ${event.last_name}`}
                      width={32}
                      height={32}
                      className="object-contain w-8 h-8 absolute bottom-0 rounded-full"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center text-xs rounded-full">
                      {event.first_name[0]}
                      {event.last_name[0]}
                    </div>
                  )}
                </Button>
              ))}
            </div>

            {/* Content section with fixed proportions */}
            <div className="">
              {currentEvent && (
                <div className="h-full flex flex-col justify-center">
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col gap-0">
                      <p
                        className={cn(
                          'text-3xl',
                          currentEvent.isTodayEvent &&
                            (activeTab === 'birthdays'
                              ? 'text-pink-500'
                              : 'text-orange-500'),
                        )}
                      >
                        <span className="font-light">{currentEvent.first_name}</span>{' '}
                        <span className="font-bold">{currentEvent.last_name}</span>
                      </p>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        {activeTab === 'birthdays' && <Cake className="h-4 w-4" />}
                        {activeTab === 'anniversaries' && (
                          <BriefcaseIcon className="h-3.5 w-3.5" />
                        )}
                        <p>{format(currentEvent.nextOccurrence, 'MMMM d')}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground w-4/5">
                      {activeTab === 'birthdays' ? (
                        <>
                          {currentEvent.isTodayEvent ? (
                            <>Today is {currentEvent.first_name}'s birthday!</>
                          ) : currentEvent.daysUntil === 0 ? (
                            <>
                              Make sure to wish{' '}
                              <span className="font-bold">{currentEvent.first_name}</span>{' '}
                              a happy birthday tomorrow!
                            </>
                          ) : (
                            <>
                              <span className="font-bold">{currentEvent.first_name}</span>{' '}
                              is going to be celebrating a birthday in{' '}
                              <span className="font-bold">
                                {currentEvent.daysUntil} days!
                              </span>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          Celebrate {currentEvent.first_name}'s work anniversary{' '}
                          {currentEvent.isTodayEvent
                            ? 'Today!'
                            : currentEvent.daysUntil === 0
                              ? 'Tomorrow!'
                              : `in ${currentEvent.daysUntil} days!`}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}
              <div className="absolute right-4 bottom-0 h-[90%]">
                {currentEvent.profile_picture ? (
                  <Image
                    src={currentEvent.profile_picture}
                    alt={`${currentEvent.first_name} ${currentEvent.last_name}`}
                    width={250}
                    height={250}
                    key={currentEvent.profile_picture}
                    className="h-full w-auto object-cover rounded-r-lg transition-all duration-500 animate-slide-up-fade-in"
                  />
                ) : (
                  <div className="h-full w-32 bg-muted flex items-center justify-center rounded-r-lg">
                    <div className="text-2xl">
                      {currentEvent.first_name[0]}
                      {currentEvent.last_name[0]}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default GenericDepartmentStaffEventsCard;
