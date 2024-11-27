'use client';

import React from 'react';
import { createBrowserClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle, Speech } from 'lucide-react';
import ArticleCard from '@/components/molecules/ArticleCard/ArticleCard';
import { Separator } from '@/components/ui/separator';

const AnnouncementsNewsPage = () => {
  const supabase = createBrowserClient();

  const { data: articles, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('article_type', 'announcement')
        .eq('public', true)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
  });

  // Find the most recent featured announcement
  const featuredAnnouncement = articles?.find((article) => article.featured === true);

  // Filter out the featured announcement from the rest
  const filteredAnnouncements = articles?.filter(
    (article) => article.id !== featuredAnnouncement?.id,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold px-8 pt-8">Announcements</h1>
      <div className="container mx-auto p-4 flex flex-col gap-14">
        {featuredAnnouncement && (
          <section className="h-[400px]">
            <ArticleCard articleId={featuredAnnouncement.id} size="xlarge" />
          </section>
        )}

        <Separator />

        <section>
          <h2 className="text-2xl ml-4 font-semibold mb-4 flex items-center gap-2">
            <Speech className="h-4 w-4" />
            All Announcements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[200px]">
            {filteredAnnouncements && filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => (
                <ArticleCard key={announcement.id} articleId={announcement.id} />
              ))
            ) : (
              <p className="text-muted-foreground col-span-2 text-center">
                No announcements available
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnnouncementsNewsPage;
