import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SmilePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { userProfileOptions } from '@/types/userProfileTypes';
import { useArticleReactions, useToggleArticleReaction } from '@/queries/articles/hooks';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ReactionDetailsDialog } from '@/components/molecules/ReactionDetailsDialog/ReactionDetailsDialog';

const allReactions = {
  like: { emoji: '👍' },
  love: { emoji: '❤️' },
  laugh: { emoji: '😂' },
  fire: { emoji: '🔥' },
  sad: { emoji: '😢' },
};

const ArticleReactions = ({ articleId }: { articleId: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: currentUser } = useQuery(userProfileOptions);
  const { data: reactions = [] } = useArticleReactions(articleId);
  const toggleReaction = useToggleArticleReaction(articleId);

  // Group reactions by type
  const reactionsByType = Object.fromEntries(
    Object.entries(allReactions).map(([type, { emoji }]) => [
      type,
      {
        emoji,
        reactions: reactions.filter((reaction) => reaction.react_type === type),
      },
    ]),
  );

  const activeReactions = Object.entries(reactionsByType).filter(
    ([_, { reactions }]) => reactions.length > 0,
  );

  const totalReactions = reactions.length;

  // Get current user's reaction if any
  const currentUserReaction = reactions.find(
    (reaction) => reaction.user_id === currentUser?.id,
  )?.react_type;

  // Get latest reactor for the summary text
  const latestReaction = reactions.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )[0];

  const { data: latestReactor } = useUserProfile(latestReaction?.user_id ?? '');

  const handleReaction = (reactionType: string) => {
    if (!currentUser?.id) return;
    toggleReaction.mutate({ reactionType, userId: currentUser.id });
    setIsOpen(false);
  };

  return (
    <div className="flex items-center flex-row justify-start gap-4 group/reaction-popover">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 flex items-center">
            <SmilePlus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        {totalReactions === 0 && (
          <p className="text-muted text-sm select-none group-hover/reaction-popover:text-muted-foreground transition-colors">
            React to this article!
          </p>
        )}
        <PopoverContent className="w-auto p-1" side="right">
          <div className="flex gap-1">
            {Object.entries(allReactions).map(([key, { emoji }]) => (
              <Button
                key={key}
                variant="ghost"
                size="sm"
                onClick={() => handleReaction(key)}
                className={cn('px-2 py-0', currentUserReaction === key && 'bg-secondary')}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {totalReactions > 0 && (
        <ReactionDetailsDialog
          reactions={reactions}
          trigger={
            <Button
              variant="ghost"
              size="default"
              className="flex items-center gap-1.5 text-lg hover:bg-transparent group/reaction-summary p-0 transition-all"
            >
              <div className="flex items-center gap-1">
                {activeReactions.map(([type, { emoji }]) => (
                  <span key={type} className="text-lg animate-slide-left-fade-in">
                    {emoji}
                  </span>
                ))}
              </div>

              <p className="font-bold text-muted-foreground animate-slide-right-fade-in animated-underline-1 after:bottom-1">
                {totalReactions === 1 &&
                  latestReactor &&
                  `${latestReactor.first_name} ${latestReactor.last_name}`}
                {totalReactions === 2 &&
                  latestReactor &&
                  `${latestReactor.first_name} ${latestReactor.last_name} and 1 other`}
                {totalReactions > 2 &&
                  latestReactor &&
                  `${latestReactor.first_name} ${latestReactor.last_name} and ${(totalReactions - 1).toLocaleString()} others`}
              </p>
            </Button>
          }
        />
      )}
    </div>
  );
};

export default ArticleReactions;
