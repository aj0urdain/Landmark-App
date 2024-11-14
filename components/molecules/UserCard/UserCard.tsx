import React, { useCallback, useState, useEffect } from 'react';

import { Card } from '@/components/ui/card';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import debounce from 'lodash/debounce';
import BranchBadge from '@/components/molecules/BranchBadge/BranchBadge';
import DepartmentBadge from '@/components/molecules/DepartmentBadge/DepartmentBadge';
import { IdCard, Sun } from 'lucide-react';
import EmailContact from '@/components/atoms/EmailContact/EmailContact';
import PhoneContact from '@/components/atoms/PhoneContact/PhoneContact';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { Separator } from '@/components/ui/separator';
import { Dot } from '@/components/atoms/Dot/Dot';

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
    <span className={`inline-block ${shouldAnimate ? 'animate-slide-down-fade-in' : ''}`}>
      {digit}
    </span>
  );
};

const UserCard = ({
  userId,
  isWelcome = false,
}: {
  userId: string;
  isWelcome?: boolean;
}) => {
  const [hoveredUserId, setHoveredUserId] = useState<boolean>(false);

  const supabase = createBrowserClient();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [time, setTime] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
    ampm: 'AM',
  });
  const [prevTime, setPrevTime] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
    ampm: 'AM',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setPrevTime(time);
      setTime({
        hours: (now.getHours() % 12 || 12).toString().padStart(2, '0'),
        minutes: now.getMinutes().toString().padStart(2, '0'),
        seconds: now.getSeconds().toString().padStart(2, '0'),
        ampm: now.getHours() >= 12 ? 'PM' : 'AM',
      });
      setCurrentTime(now);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [time]);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profile_complete')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error(error);
      }

      console.log(data);

      return data;
    },
  });

  const debouncedSetHoveredUserId = useCallback(
    debounce((state: boolean) => {
      setHoveredUserId(state);
    }, 10),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSetHoveredUserId.cancel();
    };
  }, [debouncedSetHoveredUserId]);

  if (isLoading || isError) {
    return null;
  }

  return (
    <Card
      key={user?.id}
      className="relative flex h-full min-h-[300px] flex-col items-start justify-between gap-4 p-6 w-full group transition-all duration-300 overflow-hidden"
    >
      <div className="absolute left-0 top-0 z-10 flex h-full transition-all duration-300 w-full flex-col items-start justify-between bg-gradient-to-br from-muted/50 to-transparent p-0" />
      <div className="group-hover:flex hidden group-hover:opacity-100 opacity-0 absolute left-0 top-0 z-10 h-full animate-slide-up-fade-in group-hover:animate-pulse transition-all duration-300 w-full flex-col items-start justify-between bg-gradient-to-br from-muted/75 to-transparent p-0 animation-fill-forwards group-hover:animation-fill-forwards group-hover:animation-delay-1000" />

      {user?.branches?.[0] && (
        <div className="absolute left-0 top-0 z-20 rounded-br-xl rounded-tl-xl bg-muted/25 px-4 py-2 text-xl font-bold">
          <BranchBadge branchName={user.branches[0]} list size="small" colored={false} />
        </div>
      )}
      <div className="relative h-full w-full z-20 flex flex-col justify-between">
        <div className="mt-6 flex w-full flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              {user?.departments?.map((department: string) => {
                if (department === 'Burgess Rawson') {
                  return null;
                }

                return (
                  <DepartmentBadge
                    list
                    size="small"
                    key={department}
                    department={department}
                  />
                );
              })}
            </div>
            <div className="flex w-fit flex-col gap-1">
              <Link
                href={`/wiki/people/${String(user?.first_name)}-${String(user?.last_name)}`}
                key={String(user?.id)}
                onMouseEnter={() => debouncedSetHoveredUserId(true)}
                onMouseLeave={() => debouncedSetHoveredUserId(false)}
              >
                <p
                  className={`text-3xl w-fit font-light relative animated-underline-1 ${
                    hoveredUserId ? 'animated-underline-1-active' : ''
                  }`}
                >
                  {user?.first_name} <span className="font-bold">{user?.last_name}</span>
                </p>
              </Link>
              {user?.roles?.map((role: string) => (
                <Link href={`/wiki/learn/roles/${role.split(' ').join('-')}`} key={role}>
                  <div
                    key={role}
                    className="flex max-w-60 w-fit items-start gap-1.5 font-semibold  text-muted-foreground"
                  >
                    <IdCard
                      className={`w-full ${
                        role.length > 20 ? 'min-w-4 max-w-4 pb-1' : 'min-w-5 max-w-5'
                      }`}
                    />
                    <p
                      className={cn(
                        role.length > 20 ? 'text-sm' : '',
                        'animated-underline-1 after:bottom-[1px] w-fit',
                      )}
                    >
                      {role}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {!isWelcome && (
            <div className="flex flex-col gap-2 text-muted-foreground/50">
              {user?.email && <EmailContact email={user.email} size="small" />}
              {user?.business_number && (
                <PhoneContact phoneNumber={user.business_number} size="small" />
              )}
            </div>
          )}
        </div>

        {!isWelcome ? (
          <div className="w-2/5">
            <Link
              href={`/wiki/people/${String(user?.first_name)}-${String(user?.last_name)}`}
              key={String(user?.id)}
              onMouseEnter={() => debouncedSetHoveredUserId(true)}
              onMouseLeave={() => debouncedSetHoveredUserId(false)}
            >
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </Link>
          </div>
        ) : (
          <div className="w-2/5">
            <Separator className="my-4 w-full" />
            <div className="flex flex-col gap-0">
              {/* Today's Date */}
              <Link href={`/events`}>
                <div className="flex items-center gap-1.5 animated-underline-1 w-fit after:bottom-[-1px]">
                  <p className="text-xs font-medium text-muted-foreground">
                    {currentTime.toLocaleDateString('en-US', {
                      weekday: 'long',
                    })}
                  </p>
                  <Dot size="tiny" className="bg-muted-foreground animate-pulse" />
                  <p className="text-xs text-muted-foreground">
                    {currentTime.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </Link>

              {/* Alarm Clock Style Time */}
              <div className="flex items-center gap-2">
                <div className="font-lexia font-bold">
                  <AnimatedDigit digit={time.hours[0]} prevDigit={prevTime.hours[0]} />
                  <AnimatedDigit digit={time.hours[1]} prevDigit={prevTime.hours[1]} />
                  <span className="text-sm text-muted-foreground">:</span>
                  <AnimatedDigit
                    digit={time.minutes[0]}
                    prevDigit={prevTime.minutes[0]}
                  />
                  <AnimatedDigit
                    digit={time.minutes[1]}
                    prevDigit={prevTime.minutes[1]}
                  />

                  <span className="ml-1 text-xs text-muted-foreground">{time.ampm}</span>
                </div>
              </div>

              <Separator className="my-4 w-1/3" />

              <div className="flex w-fit items-center gap-1 text-muted-foreground">
                <Sun className="h-3 w-3" />
                <p className="text-xs font-medium">
                  Have a good {time.ampm === 'AM' ? 'morning' : 'afternoon'}!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className={`absolute h-full flex items-end z-20 ${
          isWelcome ? 'right-0 top-2' : 'right-4 top-4'
        }`}
      >
        {user?.profile_picture ? (
          <Link
            href={`/wiki/people/${String(user.first_name)}-${String(user.last_name)}`}
            key={String(user.id)}
            onMouseEnter={() => debouncedSetHoveredUserId(true)}
            onMouseLeave={() => debouncedSetHoveredUserId(false)}
            className="h-full"
          >
            <Image
              src={user.profile_picture}
              alt={user.first_name ?? 'User Profile Picture'}
              sizes="250px"
              width={1382}
              height={1632}
              className="h-full w-auto object-cover rounded-r-xl transition-all duration-500 group-hover:drop-shadow-[-75px_-100px_200px_rgba(255,255,255,0.35)] animate-slide-up-fade-in animation-delay-1000 animation-fill-forwards"
            />
          </Link>
        ) : (
          <div className="h-full w-full rounded-r-xl" />
        )}
      </div>
    </Card>
  );
};

export default UserCard;
