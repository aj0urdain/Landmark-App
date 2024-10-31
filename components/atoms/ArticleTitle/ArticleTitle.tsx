import React, { useState } from 'react';
import { Article } from '@/types/articleTypes';
import { Label } from '@/components/ui/label';
import { Heading1, PencilIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { createBrowserClient } from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ArticleTitleProps {
  article: Article;
  editing: boolean;
}

const ArticleTitle = ({ article, editing }: ArticleTitleProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(article.title);
  const supabase = createBrowserClient();
  const queryClient = useQueryClient();

  const handleTitleUpdate = async () => {
    const { error } = await supabase
      .from('articles')
      .update({ title: newTitle })
      .eq('id', article.id)
      .select();

    if (!error) {
      setIsDialogOpen(false);
    } else {
      console.error('Error updating title:', error);
      // You might want to add error handling/user feedback here
    }
  };

  const titleMutation = useMutation({
    mutationFn: handleTitleUpdate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['article', article.id.toString()],
      });
    },
  });

  return (
    <>
      <div
        className={`flex flex-col gap-4 ${
          editing
            ? 'mt-10 cursor-pointer hover:text-warning-foreground group transition-all duration-300'
            : ''
        }`}
        onClick={() => {
          if (editing) {
            setIsDialogOpen(true);
          }
        }}
      >
        {editing && (
          <Label className="flex flex-row gap-2 items-center text-xl uppercase font-bold text-muted group-hover:cursor-pointer group-hover:text-warning-foreground group-hover:translate-x-2 group-hover:animate-pulse transition-all duration-300">
            <Heading1 />
            Title
            <PencilIcon className="hidden group-hover:block group-hover:animate-slide-right-fade-in w-4 h-4" />
          </Label>
        )}
        <div className="flex flex-row gap-4 items-center">
          <h1 className="text-5xl font-black tracking-tight">{article.title}</h1>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Title</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                }}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                titleMutation.mutate();
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArticleTitle;
