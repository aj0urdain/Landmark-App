import { CommentWithReactions } from '@/queries/articles/types';
import { useUser } from '@/queries/users/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Reply, SmilePlus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { articleKeys, useArticleCommentReactions } from '@/queries/articles/hooks';
import { deleteArticleComment, insertArticleComment } from '@/queries/articles/api';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toggleArticleCommentReaction } from '@/queries/articles/api';
import { userProfileOptions } from '@/types/userProfileTypes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserProfileCard } from '../UserProfileCard/UserProfileCard';
import { ReactionDetailsDialog } from '../ReactionDetailsDialog/ReactionDetailsDialog';
import { Reaction } from '@/types/articleTypes';
import ReactTimeAgo from 'react-time-ago';
import { Dot } from '@/components/atoms/Dot/Dot';

interface CommentItemProps {
  comment: CommentWithReactions;
  commentMap: Record<string, CommentWithReactions>;
}

const allReactions = {
  like: { emoji: '👍' },
  love: { emoji: '❤️' },
  laugh: { emoji: '😂' },
  fire: { emoji: '🔥' },
  sad: { emoji: '😢' },
};

export const CommentItem = ({ comment, commentMap }: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [loadingReaction, setLoadingReaction] = useState<string | null>(null);
  const [isReactionPopoverOpen, setIsReactionPopoverOpen] = useState(false);
  const [isUserHovered, setIsUserHovered] = useState(false);
  // get user from userprofileoptions
  const { data: clientUser } = useQuery(userProfileOptions);

  const { data: commentUser } = useUser(comment.created_by);
  const { data: replyingToUser } = useUser(
    comment.replyingToId ? commentMap[comment.replyingToId].created_by : '',
  );

  const { data: reactions = [] } = useArticleCommentReactions(comment.id);

  const { mutate: submitReply, isPending } = useMutation({
    mutationFn: () => insertArticleComment(comment.article_id, replyText, comment.id),
    onSuccess: () => {
      setReplyText('');
      setIsReplying(false);
      void queryClient.invalidateQueries({
        queryKey: articleKeys.comments(comment.article_id),
      });
    },
  });

  const { mutate: toggleReaction } = useMutation({
    mutationFn: (reactionType: string) => {
      setLoadingReaction(reactionType);
      return toggleArticleCommentReaction(comment.id, reactionType, clientUser?.id ?? '');
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: articleKeys.commentReactions(comment.id),
      });
      setLoadingReaction(null);
    },
    onError: () => {
      setLoadingReaction(null);
    },
  });

  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteArticleComment(comment.id),
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      void queryClient.invalidateQueries({
        queryKey: articleKeys.comments(comment.article_id),
      });
    },
  });

  const handleSubmitReply = () => {
    if (!replyText.trim() || isPending) return;
    submitReply();
  };

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
    (reaction) => reaction.user_id === clientUser?.id,
  )?.react_type;

  const latestReaction = reactions.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const { data: latestReactor } = useUser(latestReaction[0]?.user_id ?? '');

  return (
    <div className="">
      <div
        id={`comment-${comment.id}`}
        className="p-4 rounded-lg flex gap-2 border border-transparent group/comment"
      >
        <div
          className={cn('flex items-start', replyingToUser ? 'mt-3' : 'mt-1.5')}
          onMouseEnter={() => setIsUserHovered(true)}
          onMouseLeave={() => setIsUserHovered(false)}
        >
          <UserProfileCard
            id={commentUser?.id ?? ''}
            showAvatar
            showHoverCard={false}
            avatarOnly
            variant="minimal"
            avatarSize={replyingToUser ? 'sm' : 'md'}
            groupHovered={isUserHovered}
          />
        </div>
        <div className="flex flex-col gap-0 w-fit">
          <div
            className="flex w-fit items-center"
            onMouseEnter={() => setIsUserHovered(true)}
            onMouseLeave={() => setIsUserHovered(false)}
          >
            <UserProfileCard
              id={commentUser?.id ?? ''}
              showName={true}
              showAvatar={false}
              textSize={replyingToUser ? 'sm' : 'lg'}
              variant="minimal"
              avatarSize={replyingToUser ? 'xs' : 'sm'}
              groupHovered={isUserHovered}
            />

            <div onMouseEnter={() => setIsUserHovered(false)}>
              {comment.replyingToId && replyingToUser && (
                <div
                  className="flex items-center gap-2 ml-2 group/reply cursor-pointer"
                  onClick={() => {
                    const commentElement = document.getElementById(
                      `comment-${String(comment.replyingToId)}`,
                    );
                    if (commentElement) {
                      commentElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                      });
                      // Optional: add a brief highlight effect
                      commentElement.classList.add('text-warning-foreground');
                      commentElement.classList.add('animate-pulse');
                      commentElement.classList.add('transition-all');

                      setTimeout(() => {
                        commentElement.classList.remove('text-warning-foreground');
                        commentElement.classList.remove('animate-pulse');
                        commentElement.classList.remove('transition-all');
                      }, 2000);
                    }
                  }}
                >
                  <div>
                    <Reply className="h-3.5 w-3.5 group-hover/reply:rotate-90 transition-all" />
                  </div>
                  <p
                    className={cn(
                      'text-muted-foreground/50 animated-underline hover:text-foreground transition-all cursor-pointer font-light',
                      replyingToUser ? 'text-sm' : '',
                    )}
                  >
                    {replyingToUser.first_name}{' '}
                    <span className="font-bold">{replyingToUser.last_name}</span>
                  </p>
                </div>
              )}
            </div>
            <p className="text-xs group-hover/comment:text-muted-foreground text-muted flex items-center ml-2 transition-all select-none">
              <div className="hidden group-hover/comment:flex">
                <Dot size="tiny" className="bg-muted-foreground animate-pulse" />
              </div>
              <div className="flex items-center group-hover/comment:translate-x-2 transition-all">
                <ReactTimeAgo date={new Date(comment.created_at)} />
              </div>
            </p>
          </div>

          <div className="flex gap-2 w-fit mb-2">
            <p
              className={cn(
                'font-light',
                replyingToUser ? 'text-sm' : '',
                comment.deleted && 'text-muted-foreground/50',
                'text-inherit',
              )}
            >
              {comment.comment}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            {totalReactions > 0 && (
              <ReactionDetailsDialog
                reactions={reactions}
                trigger={
                  <div className="flex items-center gap-1 mb-1 group/reaction-summary cursor-pointer p-0 transition-all">
                    <div className="flex items-center gap-1">
                      {activeReactions.map(([key, { emoji }]) => (
                        <span key={key} className="animate-slide-left-fade-in">
                          {emoji}
                        </span>
                      ))}
                    </div>
                    <p
                      key={totalReactions}
                      className="text-xs text-muted group-hover/reaction-summary:text-muted-foreground group-hover/reaction-summary:animated-underline-1 animated-underline-1 animate-slide-right-fade-in"
                    >
                      {latestReactor && (
                        <>
                          {`${latestReactor.first_name} ${latestReactor.last_name}`}
                          {totalReactions > 1 && (
                            <>
                              {' and '}
                              {totalReactions === 2
                                ? '1 other'
                                : `${totalReactions - 1} others`}
                            </>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                }
              />
            )}
            <div className="flex items-center gap-2">
              <Popover
                open={isReactionPopoverOpen}
                onOpenChange={(open) => {
                  if (!open) {
                    setLoadingReaction(null);
                  }
                  setIsReactionPopoverOpen(open);
                }}
              >
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
                          toggleReaction(key);
                        }}
                        disabled={loadingReaction !== null}
                        className={cn(
                          'px-2 py-0',
                          currentUserReaction === key && 'bg-secondary',
                        )}
                      >
                        {loadingReaction === key ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          emoji
                        )}
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
                    onClick={() => {
                      setIsReplying(!isReplying);
                    }}
                    disabled={isPending}
                    className="px-2 py-0 text-muted-foreground hover:text-foreground"
                  >
                    <Reply className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="text-xs bg-background text-muted-foreground py-3 select-none"
                >
                  Reply
                </TooltipContent>
              </Tooltip>
              {clientUser?.id === comment.created_by && comment.deleted === false && (
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="px-2 py-0 hidden w-0 transition-all group-hover/comment:w-fit group-hover/comment:animate-slide-left-fade-in group-hover/comment:block bg-destructive-foreground/10 text-destructive-foreground hover:bg-destructive-foreground/20 border border-destructive-foreground/10 hover:border-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Comment</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this comment? This action cannot
                        be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setIsDeleteDialogOpen(false);
                        }}
                        disabled={isDeleting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          deleteComment();
                        }}
                        disabled={isDeleting}
                        className="flex items-center gap-2 text-foreground"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div>
      {isReplying && (
        <div className="ml-8 flex flex-col gap-2">
          <Input
            placeholder={`Reply to ${String(commentUser?.first_name)}...`}
            value={replyText}
            onChange={(e) => {
              setReplyText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmitReply();
              }
            }}
            disabled={isPending}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsReplying(false);
                setReplyText('');
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmitReply} disabled={isPending}>
              {isPending ? 'Replying...' : 'Reply'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
