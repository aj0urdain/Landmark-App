import React, { useState, useEffect } from 'react';
import { CommentThread } from '@/components/organisms/CommentThread/CommentThread';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createBrowserClient } from '@/utils/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Send } from 'lucide-react';

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
}

interface CommentSectionProps {
  entity_id: string;
  entity_type: string;
  onSubmitComment: (content: string, replyToId: string | null) => void;
  onReact: (commentId: string, reactionType: string) => void;
  setCommentNumber: (number: number) => void;
  commentNumber: number;
}

const organizeComments = (comments: Comment[]): Comment[] => {
  const commentMap: { [key: string]: Comment } = {};
  const rootComments: Comment[] = [];

  // First pass: create a map of all comments and identify root comments
  comments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, replies: [] };
    if (!comment.parent_id) {
      rootComments.push(commentMap[comment.id]);
    }
  });

  // Second pass: organize comments into a tree structure
  comments.forEach((comment) => {
    if (comment.parent_id && commentMap[comment.parent_id]) {
      const parent = commentMap[comment.parent_id];
      if (!parent.parent_id) {
        // Direct reply to a root comment
        parent.replies?.push(commentMap[comment.id]);
      } else {
        // Reply to a reply
        const rootParent = findRootParent(parent, commentMap);
        if (!rootParent.replies) rootParent.replies = [];
        rootParent.replies.push(commentMap[comment.id]);
      }
    }
  });

  // Sort root comments and their replies by creation time
  rootComments.sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
  rootComments.forEach(sortReplies);

  return rootComments;
};

const findRootParent = (
  comment: Comment,
  commentMap: { [key: string]: Comment },
): Comment => {
  if (!comment.parent_id) return comment;
  return findRootParent(commentMap[comment.parent_id], commentMap);
};

const sortReplies = (comment: Comment) => {
  if (comment.replies) {
    comment.replies.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
    comment.replies.forEach(sortReplies);
  }
};

const scrollToComment = (commentId: string) => {
  const commentElement = document.getElementById(`comment-${commentId}`);
  if (commentElement) {
    commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

export const CommentSection = React.forwardRef<HTMLDivElement, CommentSectionProps>(
  ({ entity_id, entity_type, onReact, setCommentNumber, commentNumber }, ref) => {
    const supabase = createBrowserClient();
    const [newComment, setNewComment] = useState('');

    const {
      data: comments,
      isLoading,
      error,
    } = useQuery({
      queryKey: ['comments', entity_id, entity_type],
      queryFn: async () => {
        const { data, error } = await supabase.rpc('get_comments_with_reactions', {
          p_entity_id: entity_id,
          p_entity_type: entity_type,
        });

        console.log('comment data');
        console.log(data);

        if (data === null) {
          setCommentNumber(0);
          return [];
        }

        setCommentNumber(data.length);

        return organizeComments(data as Comment[]);
      },
    });

    const queryClient = useQueryClient();

    const submitCommentMutation = useMutation({
      mutationFn: async (newCommentData: {
        content: string;
        parentId: string | null;
      }) => {
        const { data, error } = await supabase
          .from('comments')
          .insert({
            entity_id,
            entity_type,
            comment: newCommentData.content,
            parent_id: newCommentData.parentId,
          })
          .select('*')
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['comments', entity_id, entity_type],
        });
      },
    });

    const handleNewCommentChange = (content: string) => {
      setNewComment(content);
    };

    const handleSubmitComment = async (
      content: string,
      parentId: string | null = null,
    ) => {
      try {
        await submitCommentMutation.mutateAsync({ content, parentId });
        setNewComment('');
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    };

    if (isLoading) return <div>Loading comments...</div>;
    if (error) console.error('Error loading comments:', error);

    return (
      <div className="flex flex-col gap-8 w-full" ref={ref}>
        <div className="flex items-center justify-start gap-2">
          <MessageCircle className="w-6 h-6" />
          <h1 className="text-2xl font-bold">
            {commentNumber} Comment
            <span>{commentNumber != 1 && 's'}</span>
          </h1>
        </div>
        <div className="mb-4 flex flex-col items-end">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            className="w-full"
            onChange={(e) => handleNewCommentChange(e.target.value)}
          />
          <Button
            onClick={() => handleSubmitComment(newComment)}
            variant="outline"
            className="mt-2 w-fit"
          >
            <Send className="w-3 h-3 mr-2" />
            Post Comment
          </Button>
        </div>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              onReact={onReact}
              onReply={(content, parentId) => handleSubmitComment(content, parentId)}
              scrollToComment={scrollToComment}
            />
          ))
        ) : (
          <p className="text-gray-500 italic">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    );
  },
);
