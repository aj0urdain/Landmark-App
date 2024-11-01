import React, { useState } from 'react';
import { Article } from '@/types/articleTypes';
import { UserProfileCard } from '../UserProfileCard/UserProfileCard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { Pencil, PlusCircle, Trash, User, UserPen } from 'lucide-react';
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
import { useUserProfile } from '@/hooks/useUserProfile';

const ArticleAuthors = ({ article, editing }: { article: Article; editing: boolean }) => {
  const [isSecondaryDialogOpen, setIsSecondaryDialogOpen] = useState(false);
  const [isTertiaryDialogOpen, setIsTertiaryDialogOpen] = useState(false);
  const [authors, setAuthors] = useState({
    primary: article.author_id,
    secondary: article.author_id_secondary ?? null,
    tertiary: article.author_id_tertiary ?? null,
  });

  const supabase = createBrowserClient();
  const queryClient = useQueryClient();

  const primaryAuthor = useUserProfile(authors.primary);
  const secondaryAuthor = useUserProfile(authors.secondary);
  const tertiaryAuthor = useUserProfile(authors.tertiary);

  const handleSecondaryAuthorUpdate = async () => {
    const { error } = await supabase
      .from('articles')
      .update({
        author_id_secondary: authors.secondary ?? null,
      })
      .eq('id', article.id)
      .select();

    if (!error) {
      setIsSecondaryDialogOpen(false);
    } else {
      console.error('Error updating secondary author:', error);
    }
  };

  const handleTertiaryAuthorUpdate = async () => {
    const { error } = await supabase
      .from('articles')
      .update({
        author_id_tertiary: authors.tertiary ?? null,
      })
      .eq('id', article.id)
      .select();

    if (!error) {
      setIsTertiaryDialogOpen(false);
    } else {
      console.error('Error updating tertiary author:', error);
    }
  };

  const secondaryAuthorMutation = useMutation({
    mutationFn: handleSecondaryAuthorUpdate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['article', article.id.toString()],
      });
    },
  });

  const tertiaryAuthorMutation = useMutation({
    mutationFn: handleTertiaryAuthorUpdate,
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
                      <Label className="flex flex-row gap-1 items-center text-muted-foreground/50">
                        <UserPen className="w-4 h-4" />
                        Main
                      </Label>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-none cursor-not-allowed"
                      >
                        <p className="text-muted-foreground">
                          {primaryAuthor.data?.first_name}{' '}
                          <span className="font-bold">
                            {primaryAuthor.data?.last_name}
                          </span>
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
                <Label className="flex flex-row gap-1 items-center text-muted-foreground/50">
                  <UserPen className="w-4 h-4" />
                  Secondary
                </Label>
                {secondaryAuthor.data ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsSecondaryDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <p className="text-muted-foreground">
                      {secondaryAuthor.data.first_name}{' '}
                      <span className="font-bold">{secondaryAuthor.data.last_name}</span>
                    </p>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsSecondaryDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Secondary Author
                  </Button>
                )}
              </div>
              {secondaryAuthor.data && (
                <div className="flex flex-col gap-2">
                  <Label className="flex flex-row gap-1 items-center text-muted-foreground/50">
                    <UserPen className="w-4 h-4" />
                    Tertiary
                  </Label>
                  {tertiaryAuthor.data ? (
                    <Button
                      variant="outline"
                      onClick={() => setIsTertiaryDialogOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <UserProfileCard
                        id={tertiaryAuthor.data.id}
                        showAvatar
                        variant="minimal"
                        showName
                        showRoles
                      />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setIsTertiaryDialogOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Tertiary Author
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <UserProfileCard
                id={article.author_id}
                showAvatar
                variant="minimal"
                showName
                showRoles
                avatarSize="small"
              />
              {article.author_id_secondary && (
                <UserProfileCard
                  id={article.author_id_secondary}
                  showAvatar
                  variant="minimal"
                  showName
                  showRoles
                  avatarSize="small"
                />
              )}
              {article.author_id_tertiary && (
                <UserProfileCard
                  id={article.author_id_tertiary}
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

      <Dialog open={isSecondaryDialogOpen} onOpenChange={setIsSecondaryDialogOpen}>
        <DialogContent className="sm:max-w-[425px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Secondary Author</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground text-sm">Secondary Author</Label>
              <UserCombobox
                modal
                placeholder="Select Secondary Author"
                selectedUserId={authors.secondary}
                onChange={(userId) =>
                  setAuthors((prev) => ({
                    ...prev,
                    secondary: userId === '' ? null : userId,
                  }))
                }
                excludeUserIds={
                  [authors.primary, authors.tertiary].filter(Boolean) as string[]
                }
              />
            </div>
          </div>
          <DialogFooter className="flex flex-row justify-between w-full">
            {article.author_secondary && (
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={() => {
                  setAuthors((prev) => ({ ...prev, secondary: null }));
                  secondaryAuthorMutation.mutate();
                  setIsSecondaryDialogOpen(false);
                }}
              >
                <Trash className="w-4 h-4" />
              </Button>
            )}
            <div className="flex flex-row gap-2 w-full justify-end">
              <Button variant="outline" onClick={() => setIsSecondaryDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => secondaryAuthorMutation.mutate()}>
                Save changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTertiaryDialogOpen} onOpenChange={setIsTertiaryDialogOpen}>
        <DialogContent className="sm:max-w-[425px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Tertiary Author</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground text-sm">Tertiary Author</Label>
              <UserCombobox
                modal
                placeholder="Select Tertiary Author"
                selectedUserId={authors.tertiary}
                onChange={(userId) => {
                  setAuthors((prev) => ({
                    ...prev,
                    tertiary: userId === '' ? null : userId,
                  }));
                }}
                excludeUserIds={
                  [authors.primary, authors.secondary].filter(Boolean) as string[]
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="flex items-center gap-2">
              <Trash className="w-4 h-4" />
              Remove Tertiary Author
            </Button>
            <div className="flex flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsTertiaryDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  tertiaryAuthorMutation.mutate();
                }}
              >
                Save changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArticleAuthors;
