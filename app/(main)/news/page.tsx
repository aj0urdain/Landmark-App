'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, UserIcon, LoaderCircle } from 'lucide-react';
import { createBrowserClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  // Group articles by type
  const groupedArticles = articles?.reduce(
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

  const featuredArticle = articles?.[0];
  const announcements = groupedArticles?.announcement || [];
  const companyNews = groupedArticles?.company || [];
  const externalNews = groupedArticles?.external || [];

  const departmentColors = {
    Development: 'bg-blue-500',
    Finance: 'bg-green-500',
    'Human Resources': 'bg-purple-500',
    Executive: 'bg-red-500',
    Sustainability: 'bg-teal-500',
    Industry: 'bg-orange-500',
    Legal: 'bg-indigo-500',
  };

  const ArticleCard = ({ article, featured = false }) => (
    <Link href={`/news/${article.article_type}/${article.id}`}>
      <Card className={featured ? 'col-span-2' : ''}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className={featured ? 'text-2xl' : 'text-lg'}>
              {article.title}
            </CardTitle>
            {!featured && article.departments && (
              <div className="flex gap-2">
                {article.departments.map((department) => (
                  <Badge
                    key={department}
                    className={`${departmentColors[department] || 'bg-gray-500'} text-white`}
                  >
                    {department}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className={featured ? 'text-lg mb-4' : 'text-sm mb-2'}>
            {article.description}
          </p>
          {featured && article.departments && (
            <div className="flex gap-2 mb-4">
              {article.departments.map((department) => (
                <Badge
                  key={department}
                  className={`${departmentColors[department] || 'bg-gray-500'} text-white`}
                >
                  {department}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <div className="flex items-center">
            <UserIcon className="w-4 h-4 mr-1" />
            <span className="mr-4">{article.author_id}</span>
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span>{new Date(article.created_at).toLocaleDateString()}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );

  return (
    <div className="container mx-auto p-4 space-y-8">
      {featuredArticle && (
        <section>
          <ArticleCard article={featuredArticle} featured={true} />
        </section>
      )}

      {announcements.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Announcements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((announcement) => (
              <ArticleCard key={announcement.id} article={announcement} />
            ))}
          </div>
        </section>
      )}

      {companyNews.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Company News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companyNews.map((news) => (
              <ArticleCard key={news.id} article={news} />
            ))}
          </div>
        </section>
      )}

      {externalNews.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Industry News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {externalNews.map((news) => (
              <ArticleCard key={news.id} article={news} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default NewsPage;
