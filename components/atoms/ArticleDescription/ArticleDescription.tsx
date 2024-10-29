import React, { useState } from 'react';
import { Article } from '@/types/articleTypes';
import { Label } from '@/components/ui/label';
import { Heading2, PencilIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import { createBrowserClient } from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ArticleDescriptionProps {
  article: Article;
  editing: boolean;
}

const ArticleDescription = ({ article, editing }: ArticleDescriptionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDescription, setNewDescription] = useState(article.description);
  const supabase = createBrowserClient();
  const queryClient = useQueryClient();

  const handleDescriptionUpdate = async () => {
    const { error } = await supabase
      .from('articles')
      .update({ description: newDescription })
      .eq('id', article.id)
      .select();

    if (!error) {
      setIsDialogOpen(false);
    } else {
      console.error('Error updating description:', error);
    }
  };

  const descriptionMutation = useMutation({
    mutationFn: handleDescriptionUpdate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['article', article.id.toString()],
      });
    },
  });

  return (
    <>
      <div
        className={`flex flex-col gap-2 ${
          editing
            ? 'cursor-pointer hover:text-warning-foreground group transition-all duration-300 mt-10'
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
            <Heading2 />
            Description
            <PencilIcon className="hidden group-hover:block group-hover:animate-slide-right-fade-in w-4 h-4" />
          </Label>
        )}
        <div className="flex flex-row gap-4 items-center">
          <p className="text-xl text-muted-foreground group-hover:cursor-pointer group-hover:text-warning-foreground">
            {article.description}
          </p>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Description</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newDescription}
                onChange={(e) => {
                  setNewDescription(e.target.value);
                }}
                className="col-span-3"
                rows={4}
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
                descriptionMutation.mutate();
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

export default ArticleDescription;
