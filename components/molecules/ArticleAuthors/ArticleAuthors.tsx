import React, { useState } from 'react';
import { Article } from '@/types/articleTypes';
import { UserProfileCard } from '../UserProfileCard/UserProfileCard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { Pencil, PlusCircle, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { createBrowserClient } from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserCombobox } from '../UserCombobox/UserCombobox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ArticleAuthors = ({ article, editing }: { article: Article; editing: boolean }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [authors, setAuthors] = useState({
    primary: article.author.id,
    secondary: article.author_secondary?.id ?? null,
    tertiary: article.author_tertiary?.id ?? null,
  });

  const supabase = createBrowserClient();
  const queryClient = useQueryClient();

  const handleAuthorsUpdate = async () => {
    const { error } = await supabase
      .from('articles')
      .update({
        author_id: authors.primary,
        author_id_secondary: authors.secondary,
        author_id_tertiary: authors.tertiary,
      })
      .eq('id', article.id)
      .select();

    if (!error) {
      setIsDialogOpen(false);
    } else {
      console.error('Error updating authors:', error);
    }
  };

  const authorsMutation = useMutation({
    mutationFn: handleAuthorsUpdate,
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
          editing ? 'cursor-pointer group transition-all duration-300 ' : ''
        }`}
      >
        {editing && (
          <Label className="flex flex-row gap-2 items-center text-xl uppercase font-bold text-muted group-hover:text-warning-foreground group-hover:cursor-pointer group-hover:translate-x-2 transition-all duration-300">
            <User className="w-4 h-4" />
            Authors
            <Pencil className="w-4 h-4 hidden group-hover:block group-hover:text-warning-foreground group-hover:animate-slide-right-fade-in transition-all duration-300" />
          </Label>
        )}
        <div className="flex flex-row gap-8">
          {editing ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex flex-col items-start gap-2">
                      <Label>Main</Label>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-none cursor-not-allowed"
                      >
                        <p className="text-muted-foreground">
                          {article.author.first_name}{' '}
                          <span className="font-bold">{article.author.last_name}</span>
                        </p>
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-warning-foreground text-background"
                  >
                    You cannot edit the main author!
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex flex-col gap-2">
                <Label>Secondary</Label>
                {article.author_secondary ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <p className="text-muted-foreground">
                      {article.author_secondary.first_name}{' '}
                      <span className="font-bold">
                        {article.author_secondary.last_name}
                      </span>
                    </p>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Secondary Author
                  </Button>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Tertiary</Label>
                {article.author_tertiary ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <UserProfileCard
                      id={article.author_tertiary.id}
                      showAvatar
                      variant="minimal"
                      showName
                      showRoles
                    />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Tertiary Author
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <UserProfileCard
                id={article.author.id}
                showAvatar
                variant="minimal"
                showName
                showRoles
                avatarSize="small"
              />
              {article.author_secondary && (
                <UserProfileCard
                  id={article.author_secondary.id}
                  showAvatar
                  variant="minimal"
                  showName
                  showRoles
                  avatarSize="small"
                />
              )}
              {article.author_tertiary && (
                <UserProfileCard
                  id={article.author_tertiary.id}
                  showAvatar
                  variant="minimal"
                  showName
                  showRoles
                  avatarSize="small"
                />
              )}
            </>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Authors</DialogTitle>
          </DialogHeader>
          <div className="grid gap-8 py-4">
            <div className="grid gap-6">
              <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground text-sm">Secondary Author</Label>
                <UserCombobox
                  placeholder="Select Secondary Author"
                  selectedUserId={authors.secondary}
                  onChange={(userId) =>
                    setAuthors((prev) => ({ ...prev, secondary: userId }))
                  }
                  excludeUserIds={
                    [authors.primary, authors.tertiary].filter(Boolean) as string[]
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground text-sm">Tertiary Author</Label>
                <UserCombobox
                  placeholder="Select Tertiary Author"
                  selectedUserId={authors.tertiary}
                  onChange={(userId) =>
                    setAuthors((prev) => ({ ...prev, tertiary: userId }))
                  }
                  excludeUserIds={
                    [authors.primary, authors.secondary].filter(Boolean) as string[]
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => authorsMutation.mutate()}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArticleAuthors;
