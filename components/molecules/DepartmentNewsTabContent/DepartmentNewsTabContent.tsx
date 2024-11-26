'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Megaphone, Newspaper, LoaderCircle } from 'lucide-react';
import ArticleCard from '@/components/molecules/ArticleCard/ArticleCard';
import { useDepartmentAnnouncements, useDepartmentNews } from '@/queries/articles/hooks';

interface DepartmentNewsTabContentProps {
  departmentId: string;
}

const DepartmentNewsTabContent: React.FC<DepartmentNewsTabContentProps> = ({
  departmentId,
}) => {
  const { data: announcements, isLoading: isLoadingAnnouncements } =
    useDepartmentAnnouncements(Number(departmentId));
  const { data: news, isLoading: isLoadingNews } = useDepartmentNews(
    Number(departmentId),
  );

  if (isLoadingAnnouncements || isLoadingNews) {
    return (
      <div className="flex items-center justify-center h-48">
        <LoaderCircle className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Announcements Column */}
      <Card className="h-fit">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Announcements</h3>
          </div>
          <div className="space-y-4">
            {announcements && announcements.length > 0 ? (
              announcements.map((article) => (
                <ArticleCard key={article.id} articleId={String(article.id)} />
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No announcements yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* News Column */}
      <Card className="h-fit">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Company News</h3>
          </div>
          <div className="space-y-4">
            {news && news.length > 0 ? (
              news.map((article) => (
                <ArticleCard key={article.id} articleId={String(article.id)} />
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No news articles yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentNewsTabContent;
