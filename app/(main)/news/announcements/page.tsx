'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createArticle } from '@/utils/use-cases/articles/createArticle';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { createBrowserClient } from '@/utils/supabase/client';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const AnnouncementsNewsPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createBrowserClient();

  const createAnnouncementMutation = useMutation({
    mutationFn: () => createArticle('announcement'),
    onSuccess: (newArticle) => {
      router.push(`/news/announcements/${newArticle.id.toString()}`);
    },
    onError: (error) => {
      console.error('Error creating announcement:', error);
      toast({
        title: 'Error creating announcement!',
        description: 'Please try again later',
        variant: 'destructive',
      });
    },
  });

  const getAnnouncements = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('article_type', 'announcement');

    console.log('announcements', data);

    return { data, error };
  };

  const {
    data: announcements,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['announcements'],
    queryFn: getAnnouncements,
  });

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <Button
          onClick={() => {
            createAnnouncementMutation.mutate();
          }}
          disabled={createAnnouncementMutation.isPending}
        >
          <Plus className="w-4 h-4 mr-2" />
          {createAnnouncementMutation.isPending
            ? 'Creating Announcement...'
            : 'Create Announcement'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {announcements &&
          announcements.data &&
          announcements.data.length > 0 &&
          announcements.data.map((announcement) => (
            <Link
              href={`/news/announcements/${announcement.id.toString()}`}
              key={announcement.id}
            >
              <Card className="w-full relative min-h-80 flex flex-col items-start justify-end p-6 gap-2 hover:border-foreground transition-all group duration-300">
                <div className="">
                  <Image
                    src={announcement.cover_image ?? ''}
                    alt={announcement.title ?? ''}
                    width={1000}
                    height={1000}
                    className=" absolute top-0 left-0 w-full h-full object-cover object-center rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/75 to-background rounded-xl" />
                </div>

                <h1 className="text-2xl group-hover:text-[1.6rem] transition-all duration-300 font-black z-10 line-clamp-2">
                  {announcement.title}
                </h1>

                <p className="line-clamp-1 font-medium z-10 text-muted-foreground">
                  {announcement.description}
                </p>
              </Card>
            </Link>
          ))}
      </div>

      <Separator className="my-12" />

      {/* dont need to show more announcements for now */}

      <div className="mt-6">
        {/* <h1 className="text-lg font-bold text-muted-foreground">More Announcements</h1> */}
        <div className="grid grid-cols-1 gap-4 mt-6">
          {/* Dummy data for list of additional articles */}
          {new Array(10).fill(0).map((_, index) => (
            <Card key={index} className="w-full min-h-24 rounded-lg p-6">
              <h1 className="text-lg font-bold">Article title {index + 1}</h1>
              <p className="text-sm text-muted-foreground">
                Article description {index + 1}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsNewsPage;
