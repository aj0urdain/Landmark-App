'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { Doc as YDoc } from 'yjs';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BlockEditor } from '@/components/atoms/TipTap/components/BlockEditor';
import { createBrowserClient } from '@/utils/supabase/client';
import { Content } from '@tiptap/core';
import { CommentSection } from '@/components/organisms/CommentSection/CommentSection';
import { EditorHeader } from '@/components/atoms/TipTap/components/BlockEditor/components/EditorHeader';
import { useBlockEditor } from '@/components/atoms/TipTap/hooks/useBlockEditor';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import DepartmentBadge from '@/components/molecules/DepartmentBadge/DepartmentBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Eye, MessageCircle, Share } from 'lucide-react';
import Image from 'next/image';
import { UserProfileCard } from '@/components/molecules/UserProfileCard/UserProfileCard';

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

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  created_by: User;
  reactions: Reaction[];
}

export default function AnnouncementArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  const supabase = createBrowserClient();
  const queryClient = useQueryClient();

  const ydoc = useMemo(() => new YDoc(), []);
  const [canEdit, setCanEdit] = useState(false);
  const [commentNumber, setCommentNumber] = useState(0);

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_article_with_details', { article_id: parseInt(articleId) })
        .single();

      console.log('Fetched article data:', data);

      if (error) throw error;
      return data;
    },
    staleTime: 0, // This will make sure it always fetches fresh data
  });

  const { editor } = useBlockEditor({
    ydoc,
    canEdit,
    initialContent: article?.content as Content,
  });

  const saveArticleMutation = useMutation({
    mutationFn: async (content: Content) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('articles')
        .upsert({
          id: parseInt(articleId), // Include the id in the upsert
          content: content,
          updated_at: new Date().toISOString(), // Add this to trigger an update
        })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Force a refetch of the article data
      queryClient.invalidateQueries({ queryKey: ['article', articleId] });
    },
  });

  const saveArticle = async (content: Content) => {
    try {
      console.log('Saving article with content:', content);
      await saveArticleMutation.mutateAsync(content);
      console.log('Article saved successfully');
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      comment: 'This is a great announcement! Looking forward to the change.',
      created_at: '2023-06-01T12:00:00Z',
      created_by: {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        profile_picture:
          'https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/staff_images/jesselapham.png?t=2024-09-30T00%3A11%3A09.039Z',
      },
      reactions: [],
    },
    {
      id: '2',
      comment: 'I have some questions about this. Can we discuss it in the next meeting?',
      created_at: '2023-06-02T10:30:00Z',
      created_by: {
        id: '2',
        first_name: 'Jane',
        last_name: 'Smith',
        profile_picture:
          'https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/staff_images/chelseagoodall.png?t=2024-09-24T00%3A37%3A18.754Z',
      },
      reactions: [],
    },
  ]);

  const handleSubmitComment = (content: string, replyToId: string | null = null) => {
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      comment: content,
      created_at: new Date().toISOString(),
      created_by: {
        id: 'current_user',
        first_name: 'Current',
        last_name: 'User',
        profile_picture: 'https://github.com/shadcn.png',
      },
      reactions: [],
    };

    setComments((prevComments) => {
      if (replyToId) {
        return prevComments.map((comment) => {
          if (comment.id === replyToId) {
            return { ...comment, replies: [...comment.replies, newCommentObj] };
          }
          if (comment.replies.some((reply) => reply.id === replyToId)) {
            newCommentObj.comment = `@${comment.replies.find((reply) => reply.id === replyToId)?.created_by.first_name ?? ''} ${newCommentObj.comment}`;
            return { ...comment, replies: [...comment.replies, newCommentObj] };
          }
          return comment;
        });
      } else {
        return [...prevComments, newCommentObj];
      }
    });
  };

  const handleReaction = async (commentId: string, reactionType: string) => {
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

      console.log('Reaction toggle result:', data);

      // Invalidate the query to fetch fresh data
      await queryClient.invalidateQueries({
        queryKey: ['comments', articleId, 'article'],
      });

      console.log('Query invalidated, fetching fresh data...');

      // Fetch the updated comments immediately to verify the change
      const { data: updatedComments, error: fetchError } = await supabase.rpc(
        'get_comments_with_reactions',
        {
          p_entity_id: articleId,
          p_entity_type: 'article',
        },
      );

      if (fetchError) {
        console.error('Error fetching updated comments:', fetchError);
      } else {
        console.log('Updated comments:', updatedComments);
      }
    } catch (error) {
      console.error('Error in handleReaction:', error);
    }
  };

  const commentSectionRef = useRef<HTMLDivElement>(null);

  const scrollToComments = () => {
    commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert('Sharing is not supported on this browser. You can copy the URL manually.');
    }
  };

  useEffect(() => {
    if (editor && article?.content) {
      editor.commands.setContent(article.content as Content);
    }
  }, [editor, article]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!article) {
    return <div>Article not found</div>;
  }

  if (!editor) {
    return <div>Initializing editor...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <main className="flex flex-col w-full gap-0">
        {canEdit && <EditorHeader editor={editor} saveArticle={saveArticle} />}

        {/* Cover Image */}
        <div className="relative flex min-h-[30rem] items-end justify-start overflow-hidden rounded-3xl">
          <Image
            src={article.cover_image}
            alt={article.title}
            width={1000}
            height={1000}
            className="absolute left-0 top-0 h-full w-full object-cover object-bottom opacity-100"
          />
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-background/10 via-background/75 to-background"></div>
        </div>
        <div className="flex flex-col gap-12 z-10">
          {/* Date */}
          <p className="text-muted-foreground font-medium text-lg">
            {format(new Date(article.created_at), 'eeee, dd MMMM yyyy')}
          </p>

          {/* Departments, Title and Description */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-row gap-8">
              {article.departments.map((department) => (
                <DepartmentBadge
                  key={department.name}
                  department={department.name}
                  list
                  size="large"
                />
              ))}
            </div>

            <div className="flex flex-col gap-0">
              <h1 className="text-5xl font-bold">{article.title}</h1>
              <p className="mt-3 text-xl text-muted-foreground">{article.description}</p>
            </div>
          </div>

          {/* Authors */}
          <div className="flex flex-row gap-8 items-center">
            <UserProfileCard
              id={article.author.id}
              variant="minimal"
              showRoles
              showName
              showAvatar
            />
            {article.author_secondary && (
              <UserProfileCard
                id={article.author_secondary.id}
                variant="minimal"
                showRoles
                showName
                showAvatar
              />
            )}
            {article.author_tertiary && (
              <UserProfileCard
                id={article.author_tertiary.id}
                variant="minimal"
                showRoles
                showName
                showAvatar
              />
            )}
          </div>

          {/* Actions and Stats */}
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                scrollToComments();
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              {article.views} Views
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                scrollToComments();
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {commentNumber} Comment
              {commentNumber > 1 && <span>s</span>}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleShare();
              }}
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        {/* <BlockEditor canEdit={canEdit} editor={editor} /> */}

        <Separator className="my-4" />

        <CommentSection
          ref={commentSectionRef}
          entity_id={articleId}
          entity_type="article"
          onSubmitComment={handleSubmitComment}
          onReact={handleReaction}
          setCommentNumber={setCommentNumber}
          commentNumber={commentNumber}
        />
      </main>
    </div>
  );
}
