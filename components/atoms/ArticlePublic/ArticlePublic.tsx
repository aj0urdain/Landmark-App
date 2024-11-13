import { Article } from '@/types/articleTypes';
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { createBrowserClient } from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { FileWarning, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ArticlePublicProps {
  article: Article;
  editing: boolean;
}

const ArticlePublic = ({ article, editing }: ArticlePublicProps) => {
  const supabase = createBrowserClient();
  const queryClient = useQueryClient();

  const handlePublicToggle = async () => {
    const { error } = await supabase
      .from('articles')
      .update({ public: !article.public })
      .eq('id', article.id)
      .select();

    if (error) {
      console.error('Error updating public status:', error);
      // Add error handling here if needed
    }
  };

  const publicMutation = useMutation({
    mutationFn: handlePublicToggle,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['article', article.id.toString()],
      });
    },
  });

  if (!editing) return null;

  return (
    <div className="flex gap-4 items-center group">
      <div className="flex flex-row items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-row items-center gap-2">
                <HelpCircle className="h-3 w-3 text-muted-foreground" />
                <Label
                  htmlFor="public-toggle"
                  className="flex flex-row gap-2 items-center uppercase font-bold text-muted group-hover:text-warning-foreground transition-all duration-300"
                >
                  Public
                </Label>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={10}
              className="w-64 bg-background border border-warning/50 text-foreground/75 p-4 mt-1 flex flex-col gap-2"
            >
              <p
                className={`${!article.public ? 'text-muted-foreground' : 'text-muted'}`}
              >
                <span className="font-bold">OFF</span> This article can only be viewed by
                you.
              </p>
              <p className={`${article.public ? 'text-muted-foreground' : 'text-muted'}`}>
                <span className="font-bold">ON</span> This article is public and is
                subject to the authorisation settings below.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Switch
        id="public-toggle"
        checked={article.public}
        onCheckedChange={() => {
          publicMutation.mutate();
        }}
      />
    </div>
  );
};

export default ArticlePublic;
