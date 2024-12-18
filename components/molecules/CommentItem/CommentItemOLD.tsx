import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userProfileOptions } from '@/types/userProfileTypes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronsRight } from 'lucide-react';
import ReactTimeAgo from 'react-time-ago';
import { Dot } from '@/components/atoms/Dot/Dot';
import { ReactionSummary } from '@/components/molecules/ReactionSummary/ReactionSummary';
import { ReplyForm } from '@/components/molecules/ReplyForm/ReplyForm';
import { Reaction } from '@/types/commentTypes';
import { useUser } from '@/queries/users/hooks';

interface CommentItemProps {
  id: string;
}

export const CommentItem: React.FC<CommentItemProps> = ({ id }) => {
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);

  // Use the userProfileOptions query to get the current user's ID
  const { data: currentUser } = useQuery(userProfileOptions);

  const { data: commentUser, error: commentUserError } = useUser(String(created_by));

  return (
    <div
      id={`comment-${id}`}
      className={`mb-4 relative ${isReply ? 'ml-6' : ''} animate-slide-down-fade-in group`}
    >
      <div className="flex items-start space-x-4 ">
        {isReply && <ChevronsRight className="h-4 w-4 text-muted-foreground mt-2" />}
        <Avatar
          className={`border border-muted bg-gradient-to-b transition-all from-transparent to-muted group-hover:border-muted-foreground/50 group-hover:to-muted-foreground/75 overflow-visible flex items-end justify-center mt-1 ${isReply ? 'w-8 h-8' : 'w-14 h-14'}`}
        >
          <AvatarImage
            src={commentUser?.profile_picture ?? ''}
            alt={`${String(commentUser?.first_name)} ${String(commentUser?.last_name)}`}
            className="object-cover rounded-b-full w-auto h-[120%]"
          />
          <AvatarFallback>{`${String(commentUser?.first_name)}${String(commentUser?.last_name)}`}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold flex items-center gap-2">
              <h4 className="text-base font-light text-muted-foreground group-hover:text-foreground transition-all">
                {commentUser?.first_name}{' '}
                <span className="font-bold">{commentUser?.last_name}</span>
              </h4>
              <div className="text-[0.6rem] flex items-center gap-2 text-muted group-hover:text-muted-foreground transition-all">
                <Dot
                  size="small"
                  className="bg-muted group-hover:bg-muted-foreground group-hover:animate-pulse opacity-0 group-hover:opacity-100"
                />
                <div className="-translate-x-2 group-hover:translate-x-0 transition-all">
                  <ReactTimeAgo date={new Date(created_at)} locale="en-US" />
                </div>
              </div>
            </div>
          </div>
          <p className={`mt-1 text-sm flex items-center gap-1 font-medium`}>
            {isReply && (
              <span
                className="text-muted-foreground hover:underline font-normal cursor-pointer"
                onClick={() => scrollToComment?.(id)}
              >
                @{replyUserName}
              </span>
            )}
            {comment}
          </p>
          <div className="flex mt-2 items-start">
            <ReactionSummary
              reactions={reactions}
              onReact={(reactionType) => {
                onReact(id, reactionType);
              }}
              onReply={handleReply}
              currentUserId={currentUser?.id ?? ''}
            />
          </div>
          {isReplyFormOpen && (
            <div className="mt-3">
              <ReplyForm
                value={replyContent}
                onChange={onReplyContentChange}
                onSubmit={handleSubmitReply}
                onCancel={handleCancelReply}
                replyUserName={`${created_by.first_name} ${created_by.last_name}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
