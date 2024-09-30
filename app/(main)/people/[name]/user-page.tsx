"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserProfilePage } from "./_actions/getUserProfilePage";
import { useParams } from "next/navigation";

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DepartmentBadge from "@/components/molecules/DepartmentBadge/DepartmentBadge";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  addYears,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
} from "date-fns";

import {
  BookUser,
  Briefcase,
  Cake,
  CalendarHeart,
  IdCard,
  Loader2,
  Network,
  TrendingUp,
} from "lucide-react";

import BranchBadge from "@/components/molecules/BranchBadge/BranchBadge";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import EmailContact from "@/components/atoms/EmailContact/EmailContact";
import PhoneContact from "@/components/atoms/PhoneContact/PhoneContact";

export function UserPage() {
  const params = useParams();
  const name = params.name as string;

  const { data, isLoading, isError } = useQuery({
    ...getUserProfilePage,
    queryKey: [...getUserProfilePage.queryKey, name],
  });

  console.log(data?.biography_description);

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
    return `${years} year${years !== 1 ? "s" : ""}, ${months} month${months !== 1 ? "s" : ""}`;
  };

  const formatBirthday = (birthday: string) => {
    const birthdayDate = new Date(birthday);
    const formattedDate = format(birthdayDate, "d MMMM");
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
    const nextAnniversary = addYears(
      start,
      differenceInYears(today, start) + 1,
    );
    return differenceInDays(nextAnniversary, today);
  };

  const daysUntilAnniversary = calculateDaysUntilAnniversary(
    data.work_anniversary,
  );

  const workingHours = [
    { day: "Monday", hours: "8:30am - 5:30pm" },
    { day: "Tuesday", hours: "8:30am - 5:30pm" },
    { day: "Wednesday", hours: "8:30am - 5:30pm" },
    { day: "Thursday", hours: "8:30am - 5:30pm" },
    { day: "Friday", hours: "8:30am - 5:30pm" },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="relative flex h-full min-h-96 items-center justify-between border-b border-b-muted">
        <div className="z-20 flex h-full min-h-96 flex-col justify-between gap-2">
          <div />
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-1">
              <p className="animate-slide-left-fade-in text-7xl font-extrabold opacity-0 [animation-delay:_1s] [animation-duration:_0.5s] [animation-fill-mode:_forwards]">
                {data.first_name} {data.last_name}
              </p>

              <div className="ml-2 flex animate-slide-up-fade-in items-center gap-4 text-2xl font-semibold text-muted-foreground opacity-0 [animation-delay:_1.5s] [animation-duration:_0.5s] [animation-fill-mode:_forwards]">
                <div className="flex items-center gap-2">
                  <IdCard />
                  {data?.roles?.map((role: string) => role).join(", ")}
                </div>
                <div className="flex animate-slide-right-fade-in gap-2 opacity-0 [animation-delay:_2.5s] [animation-duration:_0.5s] [animation-fill-mode:_forwards]">
                  {data.departments?.map((department: string) => (
                    <DepartmentBadge
                      key={department}
                      size="medium"
                      department={department}
                      list
                    />
                  ))}
                </div>
              </div>
              {data?.branches && (
                <div className="ml-2 flex animate-slide-down-fade-in items-center gap-2 opacity-0 [animation-delay:_1.5s] [animation-duration:_0.5s] [animation-fill-mode:_forwards]">
                  <BranchBadge state={data.branches[0]} list size="medium" />
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
                        <p>
                          {daysUntilAnniversary} days until work anniversary
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}

              {data.birthday && (
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
                          {formatBirthday(data?.birthday).daysUntilBirthday}{" "}
                          days until birthday
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
          <div className="absolute z-10 flex h-full w-full items-center justify-end overflow-y-hidden">
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
          <TabsTrigger
            className="flex h-full w-full items-center gap-2"
            value="overview"
          >
            <BookUser className="h-4 w-4" />
            Overview
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
            <Card className="max-h-full w-2/3 overflow-y-scroll">
              <CardHeader className="space-y-4">
                <CardTitle className="text-2xl font-semibold text-foreground/90">
                  {data?.biography_title || "Biography"}
                </CardTitle>
                <CardDescription className="whitespace-pre-line leading-snug">
                  {data?.biography_description ||
                    "No biography available. Speak to an administrator to have your biography completed."}
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="flex w-1/3 flex-col gap-4">
              <Card className="h-fit">
                <CardHeader className="space-y-4">
                  <CardDescription className="whitespace-pre-line leading-snug">
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
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="h-fit">
                <CardHeader className="space-y-4">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-muted-foreground/80">
                    <Briefcase className="h-4 w-4" />
                    Working Hours
                  </CardTitle>
                  <CardDescription className="whitespace-pre-line leading-snug">
                    <div className="flex flex-col gap-2">
                      {workingHours.map(({ day, hours }) => (
                        <div key={day} className="flex justify-between">
                          <span className="font-medium">{day}</span>
                          <span>{hours}</span>
                        </div>
                      ))}
                      <div className="flex justify-between">
                        <span className="font-medium text-muted">Saturday</span>
                        <span className="text-muted">Not Available</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-muted">Sunday</span>
                        <span className="text-muted">Not Available</span>
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <p>Performance metrics and KPIs for this user.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
