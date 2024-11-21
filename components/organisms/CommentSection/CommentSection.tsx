import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send } from 'lucide-react';

import { articleKeys, useArticleComments } from '@/queries/articles/hooks';
import { CommentThread } from '../CommentThread/CommentThread';
import { CommentWithReactions } from '@/queries/articles/types';
import { insertArticleComment } from '@/queries/articles/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CommentSection = ({ articleId }: { articleId: number }) => {
  const [newComment, setNewComment] = useState('');
  const { data: comments } = useArticleComments(articleId);

  const queryClient = useQueryClient();

  const { mutate: insertComment } = useMutation({
    mutationFn: (comment: string) => insertArticleComment(articleId, comment),
    onSuccess: () => {
      setNewComment('');
      void queryClient.invalidateQueries({ queryKey: articleKeys.comments(articleId) });
    },
  });

  const handleInsertComment = (comment: string) => {
    try {
      insertComment(comment);
    } catch (error) {
      console.error('Error inserting comment:', error);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full scroll-mt-48">
      <div className="flex items-center justify-start gap-2 text-muted-foreground">
        <MessageCircle className="w-6 h-6" />
        <h1 className="text-xl font-bold">
          {comments?.length} Comment
          <span>{comments?.length != 1 && 's'}</span>
        </h1>
      </div>
      <div className="mb-4 flex flex-col items-end">
        <Input
          placeholder="Write a comment..."
          value={newComment}
          className="w-full"
          onChange={(e) => {
            setNewComment(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleInsertComment(newComment);
            }
          }}
        />
        <Button
          onClick={() => {
            handleInsertComment(newComment);
          }}
          variant="outline"
          className="mt-2 w-fit"
        >
          <Send className="w-3 h-3 mr-2" />
          Post Comment
        </Button>
      </div>
      {comments && comments.length > 0 ? (
        <CommentThread comments={comments as CommentWithReactions[]} />
      ) : (
        <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default CommentSection;
