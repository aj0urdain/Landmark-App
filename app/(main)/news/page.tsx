'use client';

import React from 'react';
import { createBrowserClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle, Speech } from 'lucide-react';
import ArticleCard from '@/components/molecules/ArticleCard/ArticleCard';
import { Separator } from '@/components/ui/separator';

const NewsPage = () => {
  const supabase = createBrowserClient();

  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Find the most recent featured article
  const featuredArticle = articles?.find((article) => article.featured === true);

  // Filter out the featured article from groupedArticles
  const groupedArticles = articles
    ?.filter((article) => article.id !== featuredArticle?.id)
    ?.reduce(
      (acc, article) => {
        const type = article.article_type || 'news';
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(article);
        return acc;
      },
      {} as Record<string, any[]>,
    );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  const announcements = groupedArticles?.announcement || [];
  const companyNews = groupedArticles?.company || [];
  const externalNews = groupedArticles?.external || [];

  return (
    <div className="container mx-auto p-4 flex flex-col gap-14">
      {featuredArticle && (
        <section className="h-[400px]">
          <ArticleCard articleId={featuredArticle.id} size="xlarge" />
        </section>
      )}

      <Separator className="" />

      {announcements.length > 0 && (
        <section>
          <h2 className="text-2xl ml-4 font-semibold mb-4 flex items-center gap-2">
            <Speech className="h-4 w-4" />
            Announcements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[200px]">
            {announcements.map((announcement) => (
              <ArticleCard key={announcement.id} articleId={announcement.id} />
            ))}
          </div>
        </section>
      )}

      {companyNews.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Company News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[400px]">
            {companyNews.map((news) => (
              <ArticleCard key={news.id} articleId={news.id} />
            ))}
          </div>
        </section>
      )}

      {externalNews.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Industry News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[400px]">
            {externalNews.map((news) => (
              <ArticleCard key={news.id} articleId={news.id} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default NewsPage;
