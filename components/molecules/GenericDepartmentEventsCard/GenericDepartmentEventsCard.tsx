import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CakeIcon, BriefcaseIcon, Cake } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

const getUpcomingEvents = (data: any[], eventType: string, limit = 3) => {
  const today = new Date();
  const currentYear = today.getFullYear();

  return data
    .map((user: any) => {
      const date = new Date(user[eventType]);
      const nextOccurrence = new Date(currentYear, date.getMonth(), date.getDate());
      if (nextOccurrence < today) {
        nextOccurrence.setFullYear(currentYear + 1);
      }
      return { ...user, nextOccurrence };
    })
    .sort((a: any, b: any) => a.nextOccurrence.getTime() - b.nextOccurrence.getTime())
    .slice(0, limit);
};

const GenericDepartmentEventsCard = ({
  departmentID,
  departmentName,
}: {
  departmentID: number;
  departmentName: string;
}) => {
  const [activeTab, setActiveTab] = useState<'birthdays' | 'anniversaries'>('birthdays');
  const [currentIndex, setCurrentIndex] = useState(0);
  const supabase = createBrowserClient();

  const { data: departmentData } = useQuery({
    queryKey: ['department', departmentName],
  });

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

  console.log(staffEvents);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (staffEvents?.[activeTab === 'birthdays' ? 'birthdays' : 'workAnniversaries']) {
        setCurrentIndex(
          (prev) =>
            (prev + 1) %
            staffEvents[activeTab === 'birthdays' ? 'birthdays' : 'workAnniversaries']
              .length,
        );
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [staffEvents, activeTab]);

  // Reset index when switching tabs
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  return (
    <Card className="row-span-1 flex h-1/2 flex-col relative">
      <div className="flex flex-col gap-4 text-sm text-muted w-full h-full">
        {isLoadingStaffEvents ? (
          <p>Loading events...</p>
        ) : (
          <Tabs value={activeTab} className="w-full h-full">
            <div className="absolute left-0 top-0 p-4 flex items-center gap-2">
              <TabsList className="bg-transparent">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setActiveTab(
                            activeTab === 'birthdays' ? 'anniversaries' : 'birthdays',
                          );
                        }}
                        className="hover:bg-background hover:border-muted-foreground"
                      >
                        {activeTab !== 'birthdays' ? (
                          <CakeIcon className="h-4 w-4 animate-slide-down-fade-in" />
                        ) : (
                          <BriefcaseIcon className="h-4 w-4 animate-slide-up-fade-in" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      className="text-xs z-40 flex gap-1 bg-background text-foreground"
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
              </TabsList>

              <div className="flex gap-2 ml-4">
                {staffEvents?.[
                  activeTab === 'birthdays' ? 'birthdays' : 'workAnniversaries'
                ]?.map((event, idx) => (
                  <button
                    key={event.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative h-8 w-8 rounded-full overflow-hidden transition-all z-20 ${
                      currentIndex === idx
                        ? 'ring-2 ring-primary'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    {event.profile_picture ? (
                      <Image
                        src={event.profile_picture}
                        alt={`${event.first_name} ${event.last_name}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center text-xs">
                        {event.first_name[0]}
                        {event.last_name[0]}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <TabsContent value="birthdays" className="mt-0 h-full w-full p-4">
              {staffEvents?.birthdays[currentIndex] && (
                <Link
                  href={`/wiki/people/${staffEvents.birthdays[currentIndex].first_name}-${staffEvents.birthdays[currentIndex].last_name}`}
                  key={staffEvents.birthdays[currentIndex].id}
                  className="group relative flex h-full w-full items-center justify-between overflow-hidden rounded-lg hover:bg-muted/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-xl">
                        <span className="font-light">
                          {staffEvents.birthdays[currentIndex].first_name}
                        </span>{' '}
                        <span className="font-bold">
                          {staffEvents.birthdays[currentIndex].last_name}
                        </span>
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Cake className="h-4 w-4" />
                        <p>
                          {format(
                            staffEvents.birthdays[currentIndex].nextOccurrence,
                            'MMM d',
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </TabsContent>

            <TabsContent value="anniversaries" className="mt-0 h-full w-full p-4">
              {staffEvents?.workAnniversaries[currentIndex] && (
                <Link
                  href={`/wiki/people/${staffEvents.workAnniversaries[currentIndex].first_name}-${staffEvents.workAnniversaries[currentIndex].last_name}`}
                  key={staffEvents.workAnniversaries[currentIndex].id}
                  className="group relative flex h-24 w-full items-center justify-between overflow-hidden rounded-lg p-4 hover:bg-muted/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-xl">
                        <span className="font-light">
                          {staffEvents.workAnniversaries[currentIndex].first_name}
                        </span>{' '}
                        <span className="font-bold">
                          {staffEvents.workAnniversaries[currentIndex].last_name}
                        </span>
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Cake className="h-4 w-4" />
                        <p>
                          {format(
                            staffEvents.workAnniversaries[currentIndex].nextOccurrence,
                            'MMM d',
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Card>
  );
};

export default GenericDepartmentEventsCard;
