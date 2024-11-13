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

interface ArticleAuthorisationProps {
  article: Article;
  editing: boolean;
}

const ArticleAuthorisation = ({ article, editing }: ArticleAuthorisationProps) => {
  const supabase = createBrowserClient();
  const queryClient = useQueryClient();

  const handleAuthorisationToggle = async () => {
    const { error } = await supabase
      .from('articles')
      .update({ authorisation: !article.authorisation })
      .eq('id', article.id)
      .select();

    if (error) {
      console.error('Error updating authorisation status:', error);
      // Add error handling here if needed
    }
  };

  const authorisationMutation = useMutation({
    mutationFn: handleAuthorisationToggle,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['article', article.id.toString()],
      });
    },
  });

  if (!editing) return null;

  return (
    <div className="flex gap-4 items-center group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-row items-center gap-2">
              <HelpCircle className="h-3 w-3 text-muted-foreground" />
              <Label
                htmlFor="authorisation-toggle"
                className="flex flex-row gap-2 items-center uppercase font-bold text-muted group-hover:text-warning-foreground transition-all duration-300"
              >
                Authorisation
              </Label>
              <Switch
                id="authorisation-toggle"
                checked={article.authorisation_required}
                onCheckedChange={() => {
                  authorisationMutation.mutate();
                }}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={10}
            className="w-64 bg-background border border-warning/50 text-foreground/75 p-4 mt-1 flex flex-col gap-2"
          >
            <h1 className="text-xs text-warning flex flex-row gap-2 items-start justify-start">
              <FileWarning className="h-4 w-4" />
              This feature only applies to public articles.
            </h1>
            <p
              className={`${!article.authorisation ? 'text-muted-foreground' : 'text-muted'}`}
            >
              <span className="font-bold">OFF</span> This article can be viewed by anyone
              within the organisation.
            </p>
            <p
              className={`${article.authorisation ? 'text-muted-foreground' : 'text-muted'}`}
            >
              <span className="font-bold">ON</span> This article can only be viewed by
              users within the departments listed below.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ArticleAuthorisation;
