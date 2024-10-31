import { Calendar } from '@/components/ui/calendar';
import { Article } from '@/types/articleTypes';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, PencilIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { createBrowserClient } from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ArticleDateProps {
  article: Article;
  editing: boolean;
}

const ArticleDate = ({ article, editing }: ArticleDateProps) => {
  const supabase = createBrowserClient();
  const queryClient = useQueryClient();

  const handleDateUpdate = async (newDate: Date | undefined) => {
    if (!newDate) return;

    const { error } = await supabase
      .from('articles')
      .update({ created_at: newDate.toISOString() })
      .eq('id', article.id)
      .select();

    if (error) {
      console.error('Error updating date:', error);
      // Add error handling here if needed
    }
  };

  useEffect(() => {
    console.log('article.created_at', article.created_at);
  }, [article.created_at]);

  const dateMutation = useMutation({
    mutationFn: handleDateUpdate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['article', article.id.toString()],
      });
    },
  });

  return editing ? (
    <div className="flex flex-row gap-4 items-center justify-between group">
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex flex-col gap-2 items-start">
            <Label className="flex flex-row gap-2 items-center text-xl uppercase font-bold text-muted group-hover:text-warning-foreground group-hover:translate-x-2 group-hover:animate-pulse transition-all duration-300">
              <CalendarIcon />
              Date
              <PencilIcon className="hidden group-hover:block group-hover:animate-slide-right-fade-in w-4 h-4" />
            </Label>
            <Button
              variant="outline"
              className={cn(
                'w-[250px] justify-start text-left font-normal',
                !article.created_at && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {article.created_at ? (
                format(parseISO(article.created_at), 'PPP')
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={new Date(article.created_at)}
            onSelect={(date) => {
              dateMutation.mutate(date);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  ) : (
    <p className="text-muted-foreground font-medium text-sm uppercase tracking-wide">
      {article.created_at
        ? format(parseISO(article.created_at), 'eeee, dd MMMM yyyy')
        : ''}
    </p>
  );
};

export default ArticleDate;
