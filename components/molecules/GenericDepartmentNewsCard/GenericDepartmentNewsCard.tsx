import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { Speech, Building, Calendar } from 'lucide-react';
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

const GenericDepartmentNewsCard = ({ departmentID }: { departmentID: number }) => {
  const [activeTab, setActiveTab] = useState<'announcement' | 'news'>('announcement');

  const { data: latestAnnouncement } = useQuery({
    queryKey: ['latest-department-announcement', departmentID],
    enabled: !!departmentID,
    queryFn: async () => {
      const supabase = createBrowserClient();
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
        console.error('Error fetching announcements:', error);
        return null;
      }

      console.log(data);

      return data;
    },
  });

  if (!latestAnnouncement) return null;

  return (
    <Card className="row-span-1 flex h-1/2 flex-col relative p-6 group overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-10 rounded-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-background group-hover:opacity-90 opacity-100 transition-opacity duration-300 via-background/95 to-background/90 z-10" />
        <Image
          src={latestAnnouncement.cover_image ?? ''}
          alt="Department News"
          fill
          className="object-cover rounded-xl"
        />
      </div>

      <Tabs value={activeTab} className="w-full h-full z-20">
        <div className="absolute right-0 top-0 p-4 z-20">
          <TabsList className="bg-transparent">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setActiveTab(
                        activeTab === 'announcement' ? 'news' : 'announcement',
                      );
                    }}
                    className="hover:bg-background hover:border-muted-foreground"
                  >
                    {activeTab !== 'announcement' ? (
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
          </TabsList>
        </div>

        <TabsContent
          value="announcement"
          className="w-full flex flex-col justify-between h-full mt-0 z-20"
        >
          <Link
            href={`/news/announcements/${String(latestAnnouncement.id)}`}
            className="w-full h-full"
          >
            <div className="flex flex-col justify-between w-full h-full z-20">
              {/* Article Date and Authors */}
              <div className="flex gap-2 items-center">
                <Link href={`/events`}>
                  <p className="text-xs text-muted-foreground animated-underline-1 w-fit flex items-center gap-1">
                    <Calendar className="h-2 w-2" />
                    {format(
                      parseISO(latestAnnouncement.created_at ?? ''),
                      'dd MMMM yyyy',
                    )}
                  </p>
                </Link>
                <Dot size="tiny" className="bg-muted-foreground animate-pulse" />
                <div className="flex gap-2 items-center h-fit">
                  {/* Author */}
                  {latestAnnouncement.author_id && (
                    <UserProfileCard
                      id={latestAnnouncement.author_id}
                      variant="minimal"
                      nameOnly
                      textSize="xs"
                    />
                  )}
                  {latestAnnouncement.author_id_secondary && (
                    <UserProfileCard
                      id={latestAnnouncement.author_id_secondary}
                      variant="minimal"
                      nameOnly
                      textSize="xs"
                    />
                  )}
                  {latestAnnouncement.author_id_tertiary && (
                    <UserProfileCard
                      id={latestAnnouncement.author_id_tertiary}
                      variant="minimal"
                      nameOnly
                      textSize="xs"
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1 items-start justify-start">
                {/* Department Badges */}
                <div className="flex gap-2 items-center">
                  {latestAnnouncement.departments?.map((department) => {
                    console.log(department);
                    return (
                      <DepartmentBadge
                        key={String(department)}
                        department={department}
                        id
                        list
                        size="small"
                      />
                    );
                  })}
                </div>
                <div className="flex flex-col items-start h-full">
                  <h3 className="text-2xl truncate font-bold">
                    {latestAnnouncement.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {latestAnnouncement.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </TabsContent>

        <TabsContent
          value="news"
          className="w-full flex flex-col justify-between h-full mt-0 z-20"
        >
          {/* Your news content */}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default GenericDepartmentNewsCard;
