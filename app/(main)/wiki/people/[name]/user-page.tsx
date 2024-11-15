'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserProfilePage } from './_actions/getUserProfilePage';
import { useParams, usePathname } from 'next/navigation';

import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DepartmentBadge from '@/components/molecules/DepartmentBadge/DepartmentBadge';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  addYears,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
} from 'date-fns';

import {
  BookUser,
  Briefcase,
  Building2,
  Cake,
  CalendarHeart,
  IdCard,
  Loader2,
  MessageCircle,
  Network,
  TrendingUp,
  Trophy,
} from 'lucide-react';

import BranchBadge from '@/components/molecules/BranchBadge/BranchBadge';
import { CommentSection } from '@/components/molecules/UserPage/CommentSection/CommentSection';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import EmailContact from '@/components/atoms/EmailContact/EmailContact';
import PhoneContact from '@/components/atoms/PhoneContact/PhoneContact';
import { Separator } from '@/components/ui/separator';
import BirthdayConfetti from '@/components/molecules/BirthdayConfetti/BirthdayConfetti';
import { Dot } from '@/components/atoms/Dot/Dot';
import Link from 'next/link';

export function UserPage() {
  const params = useParams();
  const name = params.name as string;

  const { data, isLoading, isError } = useQuery({
    ...getUserProfilePage,
    queryKey: [...getUserProfilePage.queryKey, name],
  });

  console.log(data);

  const [showBirthdayMessage, setShowBirthdayMessage] = useState(false);

  const isBirthday = data?.birthday
    ? new Date(data?.birthday).getDate() === new Date().getDate() &&
      new Date(data?.birthday).getMonth() === new Date().getMonth()
    : false;

  useEffect(() => {
    if (isBirthday) {
      const timer = setTimeout(() => {
        setShowBirthdayMessage(true);
      }, 3500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isBirthday]);

  const pathname = usePathname();
  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return <div>Error loading user profile</div>;
  }

  const calculateTenure = (startDate: string) => {
    const start = new Date(startDate);
    const today = new Date();
    const years = differenceInYears(today, start);
    const months = differenceInMonths(today, start) % 12;

    if (years === 0 && months === 0) {
      return 'Just started';
    }

    const yearsPart =
      years > 0 ? `${years.toFixed(0)} year${years !== 1 ? 's' : ''}` : '';
    const monthsPart =
      months > 0 ? `${months.toFixed(0)} month${months !== 1 ? 's' : ''}` : '';

    if (yearsPart && monthsPart) {
      return `${yearsPart}, ${monthsPart}`;
    }

    return yearsPart || monthsPart;
  };

  const formatBirthday = (birthday: string) => {
    const birthdayDate = new Date(birthday);
    const formattedDate = format(birthdayDate, 'd MMMM');
    const today = new Date();
    let nextBirthday = new Date(
      today.getFullYear(),
      birthdayDate.getMonth(),
      birthdayDate.getDate(),
    );
    if (nextBirthday < today) {
      nextBirthday = addYears(nextBirthday, 1);
    }
    const daysUntilBirthday = differenceInDays(nextBirthday, today);
    return { formattedDate, daysUntilBirthday };
  };

  const tenure = calculateTenure(data.work_anniversary);

  const calculateDaysUntilAnniversary = (startDate: string) => {
    const start = new Date(startDate);
    const today = new Date();
    const nextAnniversary = addYears(start, differenceInYears(today, start) + 1);
    return differenceInDays(nextAnniversary, today);
  };

  const daysUntilAnniversary = calculateDaysUntilAnniversary(data.work_anniversary);

  const workingHours = [
    { day: 'Monday', hours: '8:30am - 5:30pm' },
    { day: 'Tuesday', hours: '8:30am - 5:30pm' },
    { day: 'Wednesday', hours: '8:30am - 5:30pm' },
    { day: 'Thursday', hours: '8:30am - 5:30pm' },
    { day: 'Friday', hours: '8:30am - 5:30pm' },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-4">
      {isBirthday && (
        <div className="z-50">
          <BirthdayConfetti delay={3500} />
        </div>
      )}
      <div className="relative flex h-full min-h-96 items-center justify-between border-b border-b-muted">
        <div className="z-20 flex h-full min-h-96 flex-col justify-between gap-2">
          <div />
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-1">
              {isBirthday && showBirthdayMessage && (
                <div className="animate-slide-down-fade-in opacity-0">
                  <div className="flex w-fit items-center justify-start rounded-3xl bg-gradient-animation p-4">
                    <div className="flex animate-pulse items-center justify-center gap-2">
                      <h1 className="animate-slide-down-fade-in text-3xl font-light uppercase tracking-widest opacity-0 [animation-duration:_0.5s] [animation-fill-mode:_forwards]">
                        🥳 🎂
                      </h1>
                      <h1 className="animate-slide-down-fade-in text-3xl font-light uppercase tracking-widest opacity-0 [animation-duration:_0.5s] [animation-fill-mode:_forwards]">
                        Happy Birthday
                      </h1>
                      <h1 className="animate-slide-down-fade-in text-3xl font-light uppercase tracking-widest opacity-0 [animation-duration:_0.5s] [animation-fill-mode:_forwards]">
                        🎈 🎉
                      </h1>
                    </div>
                  </div>
                </div>
              )}

              <p
                className={`${
                  isBirthday && showBirthdayMessage ? 'mt-4' : ''
                } animate-slide-left-fade-in text-7xl font-extrabold opacity-0 [animation-delay:_1s] [animation-duration:_0.5s] [animation-fill-mode:_forwards]`}
              >
                <span className="font-light">{data.first_name}</span>{' '}
                <span className="font-black">{data.last_name}</span>
              </p>

              <div className="ml-2 flex animate-slide-up-fade-in items-center gap-4 text-2xl font-semibold text-muted-foreground opacity-0 [animation-delay:_1.5s] [animation-duration:_0.5s] [animation-fill-mode:_forwards]">
                <Link
                  href={`/wiki/learn/roles/${data?.roles?.map((role: string) => role).join('-')}`}
                >
                  <div className="flex items-center gap-2 animated-underline-1">
                    <IdCard />
                    {data?.roles?.map((role: string) => role).join(', ')}
                  </div>
                </Link>
              </div>
              {data?.branches && (
                <div className="flex items-center gap-3 mt-4">
                  <div className="ml-2 flex animate-slide-down-fade-in items-center gap-2 opacity-0 [animation-delay:_1.5s] [animation-duration:_0.5s] [animation-fill-mode:_forwards]">
                    <BranchBadge
                      branchName={data.branches?.[0] as string}
                      list
                      size="medium"
                    />
                  </div>
                  <div className="animate-slide-up-fade-in opacity-0 [animation-delay:_3s] [animation-duration:_0.5s] [animation-fill-mode:_forwards]">
                    <Dot size="small" className="bg-muted-foreground animate-pulse" />
                  </div>
                  <div className="flex animate-slide-right-fade-in gap-2 opacity-0 [animation-delay:_2.5s] [animation-duration:_0.5s] [animation-fill-mode:_forwards]">
                    {data.departments?.map((department: string) => {
                      if (department === 'Burgess Rawson') {
                        return null;
                      }

                      return (
                        <DepartmentBadge
                          key={department}
                          size="medium"
                          department={department}
                          list
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* <div className="flex w-full items-center gap-2">
              <Dot size="small" className="bg-muted" />
              <Separator className="w-full" />
            </div> */}

            <div className="ml-2 flex animate-slide-left-fade-in flex-col justify-start gap-6 opacity-0 [animation-delay:_2.5s] [animation-duration:_0.5s] [animation-fill-mode:_forwards]">
              {data.work_anniversary && (
                <div className="flex flex-col gap-1">
                  <Label className="text-xs font-extralight text-muted-foreground">
                    Tenure
                  </Label>
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <div className="flex w-fit cursor-pointer items-center justify-start gap-1 hover:underline">
                          <CalendarHeart className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-semibold">{tenure}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-transparent text-xs text-muted-foreground"
                      >
                        <p>{daysUntilAnniversary} days until work anniversary</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}

              {data.birthday && !isBirthday && (
                <div className="flex flex-col gap-1">
                  <Label className="text-xs font-extralight text-muted-foreground">
                    Birthday
                  </Label>
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <div className="flex w-fit cursor-pointer items-center justify-start gap-1 hover:underline">
                          <Cake className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-semibold">
                            {formatBirthday(data?.birthday).formattedDate}
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-transparent text-xs text-muted-foreground"
                      >
                        <p>
                          {formatBirthday(data?.birthday).daysUntilBirthday} days until
                          birthday
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          </div>
          <div />
        </div>
        {data.profile_picture && (
          <div className="absolute flex h-full w-full items-center justify-end overflow-y-hidden">
            <Image
              src={data.profile_picture}
              alt="Profile Picture"
              width={400}
              height={400}
              className="h-full w-auto animate-slide-up-fade-in object-cover opacity-0 [animation-delay:_0.5s] [animation-duration:_0.5s] [animation-fill-mode:_forwards]"
            />
          </div>
        )}
      </div>

      <Tabs
        defaultValue="overview"
        className="w-full animate-slide-down-fade-in opacity-0 [animation-delay:_2s] [animation-duration:_0.5s] [animation-fill-mode:_forwards]"
      >
        <TabsList className="h-14 w-full">
          <TabsTrigger className="flex h-full w-full items-center gap-2" value="overview">
            <BookUser className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger className="flex h-full w-full items-center gap-2" value="comments">
            <MessageCircle className="h-4 w-4" />
            Comments
          </TabsTrigger>
          <TabsTrigger
            disabled={true}
            className="flex h-full w-full cursor-not-allowed items-center gap-2"
            value="achievements"
          >
            <Trophy className="h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger
            disabled={true}
            className="flex h-full w-full cursor-not-allowed items-center gap-2"
            value="performance"
          >
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger
            disabled={true}
            className="flex h-full w-full cursor-not-allowed items-center gap-2"
            value="org chart"
          >
            <Network className="h-4 w-4" />
            Org Chart
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="flex w-full animate-slide-down-fade-in gap-4 py-6">
            <Card className="h-fit max-h-full w-2/3 overflow-y-scroll py-4">
              <CardHeader className="flex flex-col gap-6">
                <CardTitle className="italicf border-l-2 border-l-muted pl-4 text-4xl">
                  {data?.biography_title || 'Biography'}
                </CardTitle>
                <CardDescription className="whitespace-pre-line px-4 text-justify leading-snug">
                  {data?.biography_description ||
                    'No biography available. Speak to an administrator to have your biography completed.'}
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="flex w-1/3 flex-col gap-4">
              <Card className="h-fit">
                <CardHeader className="space-y-4">
                  <div className="whitespace-pre-line leading-snug">
                    <div className="flex flex-col gap-4">
                      <EmailContact email={data.email} size="medium" />
                      {data.business_number && (
                        <PhoneContact
                          phoneNumber={data.business_number}
                          size="medium"
                          label="Business"
                        />
                      )}
                      {data.mobile_number && (
                        <PhoneContact
                          phoneNumber={data.mobile_number}
                          size="medium"
                          label="Mobile Phone"
                        />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="h-fit w-full">
                <CardHeader className="space-y-4">
                  <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/80">
                    <Building2 className="h-3 w-3" />
                    Office
                  </CardTitle>
                  <div className="whitespace-pre-line leading-snug">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col items-start justify-start gap-0.5">
                        <p className="text-sm font-medium text-foreground/80">
                          Level 20, 150 Lonsdale Street
                          {/* hardcoded values TODO: create branch_location table */}
                        </p>
                        <p className="text-xs text-muted-foreground/80">
                          Melbourne VIC 3000
                          {/* hardcoded values TODO: create branch_location table */}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <Separator className="mx-6 w-[calc(100%-48px)] bg-muted" />

                <CardHeader className="space-y-4">
                  <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/80">
                    <Briefcase className="h-3 w-3" />
                    Working Hours
                  </CardTitle>
                  <div className="whitespace-pre-line leading-snug">
                    <div className="flex flex-col gap-2">
                      {workingHours.map(({ day, hours }) => (
                        <p key={day} className="flex justify-between text-sm">
                          <span className="font-medium text-muted-foreground">{day}</span>
                          <span className="font-semibold text-foreground/80">
                            {hours}
                          </span>
                        </p>
                      ))}
                      <p className="flex justify-between">
                        <span className="font-medium text-muted">Saturday</span>
                        <span className="text-muted">Not Available</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-medium text-muted">Sunday</span>
                        <span className="text-muted">Not Available</span>
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="comments">
          <CommentSection />
        </TabsContent>

        <TabsContent value="performance">
          <p>Performance metrics and KPIs for this user.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
