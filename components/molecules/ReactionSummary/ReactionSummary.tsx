import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SmilePlus, Reply } from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

interface Reaction {
  type: 'like' | 'love' | 'laugh' | 'fire' | 'sad';
  user_id: string;
  react_time: string;
  user: User;
}

interface ReactionSummaryProps {
  reactions: Reaction[] | null;
  onReact: (reactionType: string) => void;
  onReply: () => void;
  currentUserId: string;
}

export const ReactionSummary: React.FC<ReactionSummaryProps> = ({
  reactions,
  onReact,
  onReply,
  currentUserId,
}) => {
  // Determine the user's selected reaction
  const userReaction = reactions?.find((reaction) => reaction.user_id === currentUserId);
  const selectedReaction = userReaction ? userReaction.type : null;
  const allReactions = {
    like: {
      emoji: '👍',
      reactions: reactions?.filter((reaction) => reaction.type === 'like') ?? [],
    },
    love: {
      emoji: '❤️',
      reactions: reactions?.filter((reaction) => reaction.type === 'love') ?? [],
    },
    laugh: {
      emoji: '😂',
      reactions: reactions?.filter((reaction) => reaction.type === 'laugh') ?? [],
    },
    fire: {
      emoji: '🔥',
      reactions: reactions?.filter((reaction) => reaction.type === 'fire') ?? [],
    },
    sad: {
      emoji: '😢',
      reactions: reactions?.filter((reaction) => reaction.type === 'sad') ?? [],
    },
  };

  const activeReactions = Object.entries(allReactions).filter(
    ([_, { reactions }]) => reactions.length > 0,
  );
  const totalReactions = activeReactions.reduce(
    (sum, [_, { reactions }]) => sum + reactions.length,
    0,
  );

  const latestReaction = reactions?.sort(
    (a, b) => new Date(b.react_time).getTime() - new Date(a.react_time).getTime(),
  )[0];

  const latestReactor = latestReaction?.user
    ? `${latestReaction.user.first_name || ''} ${latestReaction.user.last_name || ''}`
    : '';

  return (
    <div className="flex flex-col items-start gap-2">
      {totalReactions > 0 && (
        <Button
          variant="ghost"
          className="flex items-center gap-1.5 hover:bg-transparent group/reaction-summary p-0 transition-all"
        >
          <div className="flex items-center gap-1">
            {activeReactions.map(([key, { emoji }]) => (
              <span key={key} className="animate-slide-left-fade-in">
                {emoji}
              </span>
            ))}
          </div>

          <p
            key={totalReactions}
            className="text-xs text-muted-foreground group-hover/reaction-summary:underline animate-slide-right-fade-in"
          >
            {totalReactions === 1 && latestReactor}
            {totalReactions === 2 && `${latestReactor} and 1 other`}
            {totalReactions > 2 &&
              `${latestReactor} and ${(totalReactions - 1).toLocaleString()} others`}
          </p>
        </Button>
      )}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="px-2 py-0 text-muted-foreground hover:text-foreground"
            >
              <SmilePlus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-1" side="right">
            <div className="flex gap-1">
              {Object.entries(allReactions).map(([key, { emoji }]) => (
                <Button
                  key={key}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onReact(key);
                  }}
                  className={cn('px-2 py-0', selectedReaction === key && 'bg-secondary')}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReply}
              className="px-2 py-0 text-muted-foreground hover:text-foreground"
            >
              <Reply className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="text-xs bg-transparent text-muted-foreground"
          >
            Reply
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
