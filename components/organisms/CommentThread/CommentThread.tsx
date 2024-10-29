import React, { forwardRef, useState } from 'react';
import { CommentItem } from '@/components/molecules/CommentItem/CommentItem';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

interface Reaction {
  user_id: string;
  react_time: string;
  user: User;
}

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  created_by: User;
  parent_id: string | null;
  reactions: Reaction[] | null;
  replies?: Comment[]; // Add this line for nested replies
  parentComment?: Comment;
}

interface CommentThreadProps {
  comment: Comment;
  onReact: (commentId: string, reactionType: string) => void;
  onReply: (content: string, parentId?: string) => void;
  scrollToComment?: (commentId: string) => void;
  parentComment?: Comment;
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  onReact,
  onReply,
  scrollToComment,
  parentComment,
}) => {
  const [replyContent, setReplyContent] = useState('');

  const findParentUser = (parentId: string | null): string => {
    if (!parentId) return '';

    // Check if direct parent is the root comment
    if (parentComment?.id === parentId) {
      return `${parentComment.created_by.first_name} ${parentComment.created_by.last_name}`;
    }

    // Check in replies
    if (parentComment?.replies) {
      const replyParent = parentComment.replies.find((reply) => reply.id === parentId);
      if (replyParent) {
        return `${replyParent.created_by.first_name} ${replyParent.created_by.last_name}`;
      }
    }

    return '';
  };

  const handleReply = (content: string) => {
    onReply(content, comment.id);
    setReplyContent('');
  };

  return (
    <div id={`comment-${comment.id}`} className="flex flex-col gap-4">
      <CommentItem
        {...comment}
        onReact={onReact}
        onReply={handleReply}
        replyContent={replyContent}
        onReplyContentChange={setReplyContent}
        isReply={!!comment.parent_id}
        replyUserName={
          comment.parent_id
            ? findParentUser(comment.parent_id)
            : `${comment.created_by.first_name} ${comment.created_by.last_name}`
        }
        scrollToComment={scrollToComment}
      />
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8">
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              onReact={onReact}
              onReply={onReply}
              parentComment={comment}
            />
          ))}
        </div>
      )}
    </div>
  );
};
