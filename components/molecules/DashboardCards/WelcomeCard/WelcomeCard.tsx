"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { userProfileOptions } from "@/types/userProfileTypes";
import DepartmentBadge from "@/components/molecules/DepartmentBadge/DepartmentBadge";
import { IdCard, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

const AnimatedDigit = ({
  digit,
  prevDigit,
  animate = true,
}: {
  digit: string;
  prevDigit: string;
  animate?: boolean;
}) => {
  const shouldAnimate = animate && digit !== prevDigit;
  return (
    <span
      className={`inline-block ${shouldAnimate ? "animate-slide-down-fade-in" : ""}`}
    >
      {digit}
    </span>
  );
};

export default function WelcomeCard() {
  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery(userProfileOptions);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [time, setTime] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
    ampm: "AM",
  });
  const [prevTime, setPrevTime] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
    ampm: "AM",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setPrevTime(time);
      setTime({
        hours: (now.getHours() % 12 || 12).toString().padStart(2, "0"),
        minutes: now.getMinutes().toString().padStart(2, "0"),
        seconds: now.getSeconds().toString().padStart(2, "0"),
        ampm: now.getHours() >= 12 ? "PM" : "AM",
      });
      setCurrentTime(now);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [time]);

  if (isLoading) {
    return (
      <Card className="relative h-full w-full overflow-visible p-6">
        <div className="animate-pulse">Loading...</div>
      </Card>
    );
  }

  if (isError || !userProfile) {
    return (
      <Card className="relative h-full w-full overflow-visible p-6">
        <div>Error loading profile or no profile available</div>
      </Card>
    );
  }

  return (
    <Card className="relative h-full w-full overflow-hidden p-6">
      <div className="relative z-10 flex h-full w-3/5 animate-slide-down-fade-in flex-col justify-between">
        <div className="relative z-10 flex h-full flex-col justify-start gap-3">
          <div className="flex gap-2">
            {userProfile?.departments?.map((department: string) => (
              <DepartmentBadge
                list
                size="small"
                key={department}
                department={department}
              />
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-3xl font-bold">
              {userProfile?.first_name || "No Name Assigned"}{" "}
              {userProfile?.last_name || "No Name Assigned"}
            </p>
            {userProfile?.roles?.map((role: string) => (
              <div
                key={role}
                className="flex w-fit items-start gap-2 text-sm font-semibold text-muted-foreground"
              >
                <IdCard className="h-5 w-5" />
                {role}
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4 w-2/3" />
        <div className="flex flex-col gap-1">
          {/* Today's Date */}
          <p className="text-sm font-normal text-muted-foreground">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>

          {/* Alarm Clock Style Time */}
          <div className="flex items-center gap-2">
            <div className="font-lexia font-bold">
              <AnimatedDigit
                digit={time.hours[0]}
                prevDigit={prevTime.hours[0]}
              />
              <AnimatedDigit
                digit={time.hours[1]}
                prevDigit={prevTime.hours[1]}
              />
              <span className="text-sm text-muted-foreground">:</span>
              <AnimatedDigit
                digit={time.minutes[0]}
                prevDigit={prevTime.minutes[0]}
              />
              <AnimatedDigit
                digit={time.minutes[1]}
                prevDigit={prevTime.minutes[1]}
              />

              <span className="ml-1 text-xs text-muted-foreground">
                {time.ampm}
              </span>
            </div>
          </div>
          <Separator className="my-4 w-1/3" />

          <div className="flex w-fit items-center gap-1 text-muted-foreground">
            <Sun className="h-3 w-3" />
            <p className="text-xs font-medium">
              Have a good {time.ampm === "AM" ? "morning" : "afternoon"}!
            </p>
          </div>
        </div>
      </div>
      <div className="absolute -right-4 bottom-0 z-20 h-[100%] animate-slide-down-fade-in overflow-visible">
        <Image
          src={
            userProfile.profile_picture || "/images/default-profile-picture.png"
          }
          alt={`${userProfile.first_name} ${userProfile.last_name}`}
          className="h-full w-auto overflow-y-visible rounded-r-xl object-cover opacity-100"
          width={200}
          height={200}
        />
      </div>
    </Card>
  );
}
