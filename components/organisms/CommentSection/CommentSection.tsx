import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronsDown, MessageCircle, Send } from 'lucide-react';
import { UserProfileCard } from '@/components/molecules/UserProfileCard/UserProfileCard';
import { articleKeys, useArticleComments } from '@/queries/articles/hooks';
import { CommentThread } from '../CommentThread/CommentThread';
import { CommentWithReactions } from '@/queries/articles/types';
import { insertArticleComment } from '@/queries/articles/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { createBrowserClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

const CommentSection = ({ articleId }: { articleId: number }) => {
  const [newComment, setNewComment] = useState('');
  const [latestCommentId, setLatestCommentId] = useState<string | null>(null);
  const { data: comments } = useArticleComments(articleId);
  const supabase = createBrowserClient();

  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user?.id ?? null;
    },
  });

  const queryClient = useQueryClient();

  const { mutate: insertComment } = useMutation({
    mutationFn: (comment: string) => insertArticleComment(articleId, comment),
    onSuccess: async (data) => {
      setNewComment('');
      setLatestCommentId(data.id);
      await queryClient.invalidateQueries({ queryKey: articleKeys.comments(articleId) });

      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    },
  });

  const handleInsertComment = (comment: string) => {
    try {
      insertComment(comment);
    } catch (error) {
      console.error('Error inserting comment:', error);
    }
  };

  const scrollToLatestComment = () => {
    if (!latestCommentId) return;

    const commentElement = document.getElementById(`comment-${latestCommentId}`);
    if (commentElement) {
      commentElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      // Add highlight effect
      commentElement.classList.add('text-warning-foreground');
      commentElement.classList.add('animate-pulse');
      commentElement.classList.add('transition-all');

      setTimeout(() => {
        commentElement.classList.remove('text-warning-foreground');
        commentElement.classList.remove('animate-pulse');
        commentElement.classList.remove('transition-all');
      }, 2000);
    }
  };

  return (
    <>
      {/* Header */}

      <Card className="flex flex-col gap-8 w-full scroll-mt-48 p-6">
        <CardHeader>
          <CardTitle className="flex flex-col gap-16">
            <div className="flex items-center justify-start gap-2 text-muted-foreground">
              <MessageCircle className="w-6 h-6" />
              <h1 className="text-xl font-bold">
                {comments?.length} Comment
                <span>{comments?.length != 1 && 's'}</span>
              </h1>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-fit flex items-center gap-2 mt-2">
                <UserProfileCard
                  id={currentUser ?? ''}
                  showAvatar
                  textSize="lg"
                  variant="minimal"
                  avatarSize="md"
                  avatarOnly
                />
              </div>

              <div className="w-full flex flex-col gap-2">
                <div className="ml-1 w-fit">
                  <UserProfileCard
                    id={currentUser ?? ''}
                    showName={true}
                    showAvatar={false}
                    textSize="lg"
                    variant="minimal"
                    avatarSize="sm"
                  />
                </div>
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
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      if (newComment.length > 0) handleInsertComment(newComment);
                    }}
                    variant="ghost"
                    className="w-fit"
                    size="sm"
                    disabled={newComment.length === 0}
                  >
                    <Send className="w-3 h-3 mr-2" />
                    Post Comment
                  </Button>
                  {latestCommentId && (
                    <Button
                      onClick={scrollToLatestComment}
                      variant="ghost"
                      size="sm"
                      className="text-warning-foreground hover:text-foreground flex items-center animate-pulse gap-1 transition-all"
                    >
                      <ChevronsDown className="w-3.5 h-3.5" />
                      Jump to comment!
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        {/* Comment Input */}

        <Separator className="w-full mb-4" />
        {/* Comment Thread */}
        {comments && comments.length > 0 ? (
          <CommentThread comments={comments as CommentWithReactions[]} />
        ) : (
          <p className="text-gray-500 italic">
            No comments yet. Be the first to comment!
          </p>
        )}
      </Card>
    </>
  );
};

export default CommentSection;
