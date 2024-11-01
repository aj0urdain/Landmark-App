import React, { useState } from 'react';
import { Article, Reaction } from '@/types/articleTypes';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SmilePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createBrowserClient } from '@/utils/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { userProfileOptions } from '@/types/userProfileTypes';
import { useUserProfile } from '@/hooks/useUserProfile';

const ArticleReactions = ({ article }: { article: Article }) => {
  const queryClient = useQueryClient();
  const { data: currentUser } = useQuery(userProfileOptions);
  const currentUserId = currentUser?.id;
  const [isOpen, setIsOpen] = useState(false);

  // Determine the user's selected reaction
  const userReaction = article.reactions.find(
    (reaction: Reaction) => reaction.user_id === currentUserId,
  );

  const selectedReaction = userReaction?.type ?? null;

  const allReactions = {
    like: {
      emoji: '👍',
      reactions: Array.isArray(article.reactions)
        ? article.reactions.filter((reaction: Reaction) => reaction.type === 'like')
        : [],
    },
    love: {
      emoji: '❤️',
      reactions: Array.isArray(article.reactions)
        ? article.reactions.filter((reaction: Reaction) => reaction.type === 'love')
        : [],
    },
    laugh: {
      emoji: '😂',
      reactions: Array.isArray(article.reactions)
        ? article.reactions.filter((reaction: Reaction) => reaction.type === 'laugh')
        : [],
    },
    fire: {
      emoji: '🔥',
      reactions: Array.isArray(article.reactions)
        ? article.reactions.filter((reaction: Reaction) => reaction.type === 'fire')
        : [],
    },
    sad: {
      emoji: '😢',
      reactions: Array.isArray(article.reactions)
        ? article.reactions.filter((reaction: Reaction) => reaction.type === 'sad')
        : [],
    },
  };

  // Group reactions by type
  const reactionsByType = {
    ...allReactions,
    ...Object.fromEntries(
      Object.entries(allReactions).map(([type, { emoji }]) => [
        type,
        {
          emoji,
          reactions: Array.isArray(article.reactions)
            ? article.reactions.filter((reaction: Reaction) => reaction.type === type)
            : [],
        },
      ]),
    ),
  };

  const activeReactions = Object.entries(reactionsByType).filter(
    ([_, { reactions }]) => reactions.length > 0,
  );

  const totalReactions = Array.isArray(article.reactions) ? article.reactions.length : 0;

  // Get latest reactor for the summary text
  const latestReaction =
    Array.isArray(article.reactions) && article.reactions.length > 0
      ? article.reactions.sort(
          (a: Reaction, b: Reaction) =>
            new Date(b.react_time).getTime() - new Date(a.react_time).getTime(),
        )[0]
      : null;

  const latestReactorId = latestReaction?.user_id;

  const { data: latestReactorProfile } = useUserProfile(latestReactorId as string);

  const latestReactor = latestReactorProfile
    ? `${latestReactorProfile.first_name} ${latestReactorProfile.last_name}`
    : '';

  const handleReaction = async (reactionType: string) => {
    const supabase = createBrowserClient();
    const { error } = await supabase.rpc('toggle_article_reaction', {
      p_article_id: article.id,
      p_reaction_type: reactionType,
    });

    if (error) {
      console.error('Error toggling reaction:', error);
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ['article', article.id.toString()],
    });

    setIsOpen(false);
  };

  return (
    <div className="flex items-center flex-row justify-start gap-4 group/reaction-popover">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 flex items-center">
            <SmilePlus className="h-4 w-4" />
            {/* <p>React!</p> */}
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
                onClick={() => {
                  void handleReaction(key);
                }}
                className={cn('px-2 py-0', selectedReaction === key && 'bg-secondary')}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {totalReactions > 0 && (
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

          <p
            key={totalReactions}
            className="font-bold text-muted-foreground group-hover/reaction-summary:underline animate-slide-right-fade-in"
          >
            {totalReactions === 1 && latestReactor}
            {totalReactions === 2 && `${latestReactor} and 1 other`}
            {totalReactions > 2 &&
              `${latestReactor} and ${(totalReactions - 1).toLocaleString()} others`}
          </p>
        </Button>
      )}
    </div>
  );
};

export default ArticleReactions;
