'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, ChevronsRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import DepartmentBadge from '@/components/molecules/DepartmentBadge/DepartmentBadge';
import { UserProfileCard } from '@/components/molecules/UserProfileCard/UserProfileCard';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { Dot } from '@/components/atoms/Dot/Dot';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ArticleCardProps {
  articleId: string;
  size?: 'default' | 'large' | 'xlarge';
}

const ArticleCard = ({ articleId, size = 'default' }: ArticleCardProps) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const supabase = createBrowserClient();
  const router = useRouter();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', articleId],
    enabled: !!articleId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single();

      if (error) {
        console.error('Error fetching article:', error);
        return null;
      }

      return data;
    },
  });

  if (!article || isLoading) return null;

  const titleSizes = {
    default: 'text-2xl',
    large: 'text-3xl',
    xlarge: 'text-5xl',
  };

  const descriptionSizes = {
    default: 'text-sm',
    large: 'text-base',
    xlarge: 'text-xl',
  };

  return (
    <Card
      className={cn(
        'h-full flex flex-col relative group hover:border-muted-foreground/50 transition-colors duration-1000 overflow-hidden group/card cursor-pointer',
        isHovered && 'border-muted-foreground/50',
        size === 'xlarge' ? 'p-12' : 'p-6',
      )}
      onClick={() => {
        router.push(
          `/news/${article.article_type === 'announcement' ? 'announcements' : 'company'}/${articleId}`,
        );
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 left-0 w-full h-full z-10 rounded-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-background group-hover:opacity-90 opacity-100 transition-opacity duration-300 via-background/95 to-background/90 z-10" />
        {article.cover_image && (
          <Image
            src={article.cover_image}
            alt="Article Cover"
            fill
            sizes="250px"
            className="object-cover rounded-xl"
          />
        )}
      </div>

      <div className="flex flex-col justify-between w-full h-full z-20 cursor-pointer">
        <div className="flex gap-2 items-center">
          <Link href={`/events`} passHref>
            <p className="text-xs text-muted-foreground animated-underline-1 w-fit flex items-center gap-1">
              <Calendar className="h-2 w-2" />
              {format(parseISO(article.created_at), 'dd MMMM yyyy')}
            </p>
          </Link>
          <ChevronsRight className="h-3 w-3 text-muted-foreground" />
          <div className="flex gap-1.5 items-center h-fit">
            <UserProfileCard
              id={String(article.author_id)}
              variant="minimal"
              nameOnly
              textSize="xs"
              className="[&:not(:hover)]:text-muted-foreground group-hover/card:text-foreground transition-colors"
            />

            {article.author_id_secondary && (
              <>
                <Dot size="tiny" className="bg-muted-foreground animate-pulse" />
                <UserProfileCard
                  id={String(article.author_id_secondary)}
                  variant="minimal"
                  nameOnly
                  textSize="xs"
                  className="[&:not(:hover)]:text-muted-foreground group-hover/card:text-foreground transition-colors"
                />
              </>
            )}

            {article.author_id_tertiary && (
              <>
                <Dot size="tiny" className="bg-muted-foreground animate-pulse" />
                <UserProfileCard
                  id={String(article.author_id_tertiary)}
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
          <div className="flex gap-2 items-center">
            {article.departments?.map((department) => (
              <DepartmentBadge
                key={String(department)}
                department={department}
                list
                size={size === 'xlarge' ? 'xlarge' : 'small'}
                className="animate-slide-left-fade-in opacity-0 [animation-fill-mode:forwards]"
              />
            ))}
          </div>
          <div
            className={cn(
              'flex flex-col gap-0 -mb-2',
              size === 'xlarge' ? 'mt-2 -mb-4 gap-4' : '',
            )}
          >
            <div
              className={cn('transition-all duration-300', 'animate-slide-left-fade-in')}
            >
              <h3
                className={cn(
                  titleSizes[size],
                  'font-bold line-clamp-2 w-full [&:not(:hover)]:text-muted-foreground group-hover/card:text-foreground transition-colors duration-1000',
                )}
              >
                {article.title}
              </h3>
            </div>
            <div className="overflow-hidden transition-all duration-1000 max-h-0 group-hover/card:max-h-20">
              <p
                className={cn(
                  descriptionSizes[size],
                  'text-muted-foreground line-clamp-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000',
                )}
              >
                {article.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ArticleCard;
