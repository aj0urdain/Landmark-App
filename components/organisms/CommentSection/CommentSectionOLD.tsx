import React, { useState } from 'react';
import { CommentThread } from '@/components/organisms/CommentThread/CommentThread';

import { Button } from '@/components/ui/button';
import { createBrowserClient } from '@/utils/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Send } from 'lucide-react';
import { Comment, CommentSectionProps } from '@/types/commentTypes';
import { Input } from '@/components/ui/input';

const organizeComments = (comments: Comment[]): Comment[] => {
  const commentMap: Record<string, Comment> = {};
  const rootComments: Comment[] = [];

  // First pass: create a map of all comments
  comments.forEach((comment) => {
    commentMap[comment.id] = {
      ...comment,
      replies: [],
      parentComment: comment.parent_id
        ? (comments.find((c) => c.id === comment.parent_id) ?? undefined)
        : undefined,
    };
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
  } else {
    console.log('Comment element not found');
  }
};

export const CommentSection = React.forwardRef<HTMLDivElement, CommentSectionProps>(
  ({ entity_id, entity_type, setCommentNumber, commentNumber }, ref) => {
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

        if (data === null) {
          setCommentNumber(0);
          return [];
        }

        setCommentNumber(data.length);

        return organizeComments(data as Comment[]);
      },
    });

    const queryClient = useQueryClient();

    const handleReaction = (commentId: string, reactionType: string) => {
      void (async () => {
        try {
          console.log(
            `Attempting to toggle reaction: ${reactionType} for comment: ${commentId}`,
          );

          const { data, error } = await supabase.rpc('toggle_comment_reaction', {
            p_comment_id: commentId,
            p_reaction_type: reactionType,
          });

          if (error) {
            console.error('Error updating reaction:', error);
            throw error;
          }

          // Invalidate the query to fetch fresh data
          await queryClient.invalidateQueries({
            queryKey: ['comments', entity_id, entity_type],
          });

          // Fetch the updated comments immediately to verify the change
          const { data: updatedComments, error: fetchError } = await supabase.rpc(
            'get_comments_with_reactions',
            {
              p_entity_id: entity_id,
              p_entity_type: entity_type,
            },
          );

          if (fetchError) {
            console.error('Error fetching updated comments:', fetchError);
          }
        } catch (error) {
          console.error('Error in handleReaction:', error);
        }
      })();
    };

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

        if (error) {
          console.error('Error submitting comment:', error);
        }

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
      <div className="flex flex-col gap-8 w-full scroll-mt-48" ref={ref}>
        <div className="flex items-center justify-start gap-2 text-muted-foreground">
          <MessageCircle className="w-6 h-6" />
          <h1 className="text-xl font-bold">
            {commentNumber} Comment
            <span>{commentNumber != 1 && 's'}</span>
          </h1>
        </div>
        <div className="mb-4 flex flex-col items-end">
          <Input
            placeholder="Write a comment..."
            value={newComment}
            className="w-full"
            onChange={(e) => {
              handleNewCommentChange(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void handleSubmitComment(newComment);
              }
            }}
          />
          <Button
            onClick={() => {
              void handleSubmitComment(newComment);
            }}
            variant="outline"
            className="mt-2 w-fit"
          >
            <Send className="w-3 h-3 mr-2" />
            Post Comment
          </Button>
        </div>
        {comments && comments.length > 0 ? (
          comments.map((comment) => {
            return (
              <CommentThread
                key={comment.id}
                comment={comment}
                onReact={handleReaction}
                onReply={(content, parentId) => {
                  void handleSubmitComment(content, parentId);
                }}
                scrollToComment={scrollToComment}
                parentComment={comment.parentComment}
              />
            );
          })
        ) : (
          <p className="text-gray-500 italic">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    );
  },
);
