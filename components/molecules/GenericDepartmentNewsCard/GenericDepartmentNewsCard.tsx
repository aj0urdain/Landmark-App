import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Speech, Building, Calendar, ChevronsRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import DepartmentBadge from '@/components/molecules/DepartmentBadge/DepartmentBadge';
import { UserProfileCard } from '@/components/molecules/UserProfileCard/UserProfileCard';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { Dot } from '@/components/atoms/Dot/Dot';
import Link from 'next/link';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const GenericDepartmentNewsCard = ({ departmentID }: { departmentID: number }) => {
  const [activeTab, setActiveTab] = useState<'announcement' | 'news'>('announcement');
  const [timeLeft, setTimeLeft] = useState(10);
  const [isHovered, setIsHovered] = useState(false);

  const supabase = createBrowserClient();

  const router = useRouter();

  const { data: latestAnnouncement, isLoading: isLoadingAnnouncement } = useQuery({
    queryKey: ['latest-department-announcement', departmentID],
    enabled: !!departmentID,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .contains('departments', [departmentID])
        .eq('article_type', 'announcement')
        .eq('public', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No announcements found');
          return null;
        }
        console.error('Error fetching announcements:', error);
        return null;
      }

      return data;
    },
  });

  const { data: latestNews, isLoading: isLoadingNews } = useQuery({
    queryKey: ['latest-department-news', departmentID],
    enabled: !!departmentID,
    staleTime: 5 * 60 * 1000,

    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .contains('departments', [departmentID])
        .eq('article_type', 'news')
        .eq('public', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching news:', error);
        return null;
      }

      console.log(data);

      return data;
    },
  });

  useEffect(() => {
    // Only start timer if both types of content are available and not hovering
    if (!latestAnnouncement || !latestNews || isHovered) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setActiveTab(activeTab === 'announcement' ? 'news' : 'announcement');
          return 5; // Reset timer
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [activeTab, latestAnnouncement, latestNews, isHovered]);

  // Reset timer when manually toggling
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimeLeft(5);

    setActiveTab(activeTab === 'announcement' ? 'news' : 'announcement');
  };

  if (!latestAnnouncement && !latestNews) return null;

  if (isLoadingAnnouncement || isLoadingNews) return null;

  return (
    <Card
      key={String(activeTab)}
      className={cn(
        'row-span-1 flex h-1/2 flex-col relative p-6 group hover:border-muted-foreground/50 transition-colors duration-1000 overflow-hidden group/card cursor-pointer',
        isHovered && 'border-muted-foreground/50',
      )}
      onClick={() => {
        router.push(
          `/news/${activeTab === 'announcement' ? 'announcements' : 'company'}/${String(
            activeTab === 'announcement' ? latestAnnouncement?.id : latestNews?.id,
          )}`,
        );
      }}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full z-10 rounded-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-background group-hover:opacity-90 opacity-100 transition-opacity duration-300 via-background/95 to-background/90 z-10" />

        {(latestAnnouncement?.cover_image ?? latestNews?.cover_image) && (
          <Image
            src={
              activeTab === 'announcement'
                ? (latestAnnouncement?.cover_image ?? '')
                : (latestNews?.cover_image ?? '')
            }
            alt="Department News"
            fill
            sizes="250px"
            className="object-cover rounded-xl"
          />
        )}
      </div>

      <div className="absolute right-0 top-0 p-4 z-40">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggle}
                disabled={
                  (activeTab === 'announcement' && !latestNews) ||
                  (activeTab === 'news' && !latestAnnouncement)
                }
                className="hover:bg-background hover:border-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                {latestAnnouncement && latestNews && (
                  <div className="absolute -top-2 -right-2 bg-muted text-foreground-muted rounded-full w-4 h-4 flex items-center justify-center text-[8px]">
                    {timeLeft}
                  </div>
                )}
                {activeTab === 'announcement' ? (
                  <Speech className="h-4 w-4 animate-slide-down-fade-in" />
                ) : (
                  <Building className="h-4 w-4 animate-slide-up-fade-in" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="text-xs z-40 flex gap-1 bg-background text-foreground"
              side="left"
            >
              <p>
                Switch to{' '}
                <span className="font-bold">
                  {activeTab === 'announcement' ? 'News' : 'Announcements'}
                </span>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex flex-col justify-between w-full h-full z-20 cursor-pointer">
        {/* Article Date and Authors */}
        <div className="flex gap-2 items-center">
          <Link href={`/events`} passHref>
            <p className="text-xs text-muted-foreground animated-underline-1 w-fit flex items-center gap-1">
              <Calendar className="h-2 w-2" />
              {format(
                parseISO(latestAnnouncement?.created_at ?? latestNews?.created_at ?? ''),
                'dd MMMM yyyy',
              )}
            </p>
          </Link>
          <ChevronsRight className="h-3 w-3 text-muted-foreground" />
          <div className="flex gap-1.5 items-center h-fit">
            {/* Author */}

            <UserProfileCard
              id={
                activeTab === 'announcement'
                  ? String(latestAnnouncement?.author_id ?? '')
                  : String(latestNews?.author_id ?? '')
              }
              variant="minimal"
              nameOnly
              textSize="xs"
              className="[&:not(:hover)]:text-muted-foreground group-hover/card:text-foreground transition-colors"
            />

            {(activeTab === 'announcement'
              ? latestAnnouncement?.author_id_secondary
              : latestNews?.author_id_secondary) && (
              <>
                <Dot size="tiny" className="bg-muted-foreground animate-pulse" />
                <UserProfileCard
                  id={
                    activeTab === 'announcement'
                      ? String(latestAnnouncement?.author_id_secondary ?? '')
                      : String(latestNews?.author_id_secondary ?? '')
                  }
                  variant="minimal"
                  nameOnly
                  textSize="xs"
                  className="[&:not(:hover)]:text-muted-foreground group-hover/card:text-foreground transition-colors"
                />
              </>
            )}

            {(activeTab === 'announcement'
              ? latestAnnouncement?.author_id_tertiary
              : latestNews?.author_id_tertiary) && (
              <>
                <Dot size="tiny" className="bg-muted-foreground animate-pulse" />
                <UserProfileCard
                  id={
                    activeTab === 'announcement'
                      ? String(latestAnnouncement?.author_id_tertiary ?? '')
                      : String(latestNews?.author_id_tertiary ?? '')
                  }
                  variant="minimal"
                  nameOnly
                  textSize="xs"
                  className="[&:not(:hover)]:text-muted-foreground group-hover/card:text-foreground transition-colors"
                />
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 items-start justify-end h-full w-full">
          {/* Department Badges */}
          <div className="flex gap-2 items-center">
            {(activeTab === 'announcement'
              ? latestAnnouncement
              : latestNews
            )?.departments?.map((department) => {
              return (
                <DepartmentBadge
                  key={String(department)}
                  department={department}
                  list
                  size="small"
                  className="animate-slide-left-fade-in opacity-0 [animation-fill-mode:forwards]"
                />
              );
            })}
          </div>
          <div className="flex flex-col gap-0 -mb-2">
            <div
              className={cn('transition-all duration-300', 'animate-slide-left-fade-in')}
            >
              <h3 className="text-2xl font-bold line-clamp-2 w-full [&:not(:hover)]:text-muted-foreground group-hover/card:text-foreground transition-colors duration-1000">
                {activeTab === 'announcement'
                  ? latestAnnouncement?.title
                  : latestNews?.title}
              </h3>
            </div>
            <div className="overflow-hidden transition-all duration-1000 max-h-0 group-hover/card:max-h-20">
              <p className="text-muted-foreground line-clamp-2 text-sm opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000">
                {activeTab === 'announcement'
                  ? latestAnnouncement?.description
                  : latestNews?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <div
          
          className="w-full flex flex-col justify-between h-full mt-0 z-20"
        >
      
      </div> */}
    </Card>
  );
};

export default GenericDepartmentNewsCard;
