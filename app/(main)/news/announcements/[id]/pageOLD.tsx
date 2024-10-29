'use client';

import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
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

import { Button } from '@/components/ui/button';
import {
  Eye,
  MessageCircle,
  Pencil,
  Share,
  Calendar as CalendarIcon,
  Heading1,
  Heading2,
  User,
  Component,
} from 'lucide-react';
import Image from 'next/image';
import { UserProfileCard } from '@/components/molecules/UserProfileCard/UserProfileCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArticleDepartmentSelector } from '@/components/molecules/ArticleDepartmentSelector/ArticleDepartmentSelector';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { UserCombobox } from '@/components/molecules/UserCombobox/UserCombobox';

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

interface Article {
  id: number;
  title: string;
  description: string;
  content: Content;
  created_at: string;
  cover_image: string;
  departments: { id: number; name: string }[];
  author: User;
  author_secondary?: User;
  author_tertiary?: User;
  views: number;
}

export default function AnnouncementArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  const supabase = createBrowserClient();
  const queryClient = useQueryClient();

  const ydoc = useMemo(() => new YDoc(), []);
  const [editing, setEditing] = useState(false);
  const [commentNumber, setCommentNumber] = useState(0);
  const [isAuthor, setIsAuthor] = useState(false);

  // Move the editForm state up here with other state declarations
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    departments: [] as number[], // Change this to number[]
    created_at: new Date().toISOString(),
    author_id: '',
    author_id_secondary: null as string | null,
    author_id_tertiary: null as string | null,
  });

  // Add the mutation here with other hooks
  const updateArticleDetailsMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      departments: number[];
      created_at: string;
      author_id?: string;
      author_id_secondary?: string | null;
      author_id_tertiary?: string | null;
    }) => {
      const { error } = await supabase
        .from('articles')
        .update(data)
        .eq('id', parseInt(articleId));

      if (error) {
        console.log(error);
      }
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['article', articleId] });
    },
  });

  const { data: article, isLoading } = useQuery<Article>({
    queryKey: ['article', articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_article_with_details', { article_id: parseInt(articleId) })
        .single();

      // Check if current user is the author
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && data) {
        setIsAuthor(user.id === data.author.id);
      }

      if (error) throw error;
      return data;
    },
    staleTime: 0,
  });

  // Add useEffect to update editForm when article data is loaded
  useEffect(() => {
    if (article) {
      setEditForm({
        title: article.title,
        description: article.description,
        departments: article.departments?.map((d) => d.id), // Use department IDs
        created_at: article.created_at,
        author_id: article.author.id,
        author_id_secondary: article.author_secondary?.id || null,
        author_id_tertiary: article.author_tertiary?.id || null,
      });
    }
  }, [article]);

  const toggleEditMode = () => {
    setEditing(!editing);
  };

  const { editor } = useBlockEditor({
    ydoc,
    editing,
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
    onSuccess: async () => {
      // Force a refetch of the article data
      await queryClient.invalidateQueries({ queryKey: ['article', articleId] });
    },
  });

  const saveArticle = async (content: Content) => {
    try {
      // Save the article content
      await saveArticleMutation.mutateAsync(content);

      // Save all article details including authors
      if (editing) {
        console.log(editForm);

        await updateArticleDetailsMutation.mutateAsync({
          title: editForm.title,
          description: editForm.description,
          departments: editForm.departments,
          created_at: editForm.created_at,
          author_id: editForm.author_id,
          author_id_secondary: editForm.author_id_secondary,
          author_id_tertiary: editForm.author_id_tertiary,
        });
      }

      console.log('Article saved successfully');
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const [comments, setComments] = useState<Comment[]>([]);

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
    })();
  };

  const commentSectionRef = useRef<HTMLDivElement>(null);

  const scrollToComments = () => {
    commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (editor && article?.content) {
      // Only update content if we're switching to edit mode
      if (editing) {
        editor.commands.setContent(article.content as Content);
      } else {
        // When switching back to view mode, clear the editor content first
        editor.commands.clearContent();
        editor.commands.setContent(article.content as Content);
      }
    }
  }, [editor, article, editing]); // Add canEdit to dependencies

  // Add these utility functions near the other useCallback declarations
  const calculateTitleRows = useCallback((text: string) => {
    const lineBreaks = (text.match(/\n/g) || []).length;
    const charsPerLine = 40;
    const estimatedLines = Math.ceil(text.length / charsPerLine);
    return Math.max(lineBreaks + 1, estimatedLines, 1);
  }, []);

  const calculateDescriptionRows = useCallback((text: string) => {
    const lineBreaks = (text.match(/\n/g) || []).length;
    const charsPerLine = 50; // More chars per line since description text is smaller
    const estimatedLines = Math.ceil(text.length / charsPerLine);
    return Math.max(lineBreaks + 1, estimatedLines, 1);
  }, []);

  const getChangedFields = useCallback(() => {
    if (!article) return {};

    return {
      title: editForm.title !== article.title,
      description: editForm.description !== article.description,
      departments:
        JSON.stringify(editForm.departments.sort()) !==
        JSON.stringify(article.departments.map((d) => d.id).sort()),
      created_at: editForm.created_at !== article.created_at,
      authors:
        editForm.author_id !== article.author.id ||
        editForm.author_secondary_id !== (article.author_secondary?.id || null) ||
        editForm.author_tertiary_id !== (article.author_tertiary?.id || null),
    };
  }, [editForm, article]);

  const hasChanges = Object.values(getChangedFields()).some(Boolean);

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, department_name')
        .order('department_name');

      if (error) throw error;
      return data;
    },
  });

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
        {isAuthor && (
          <EditorHeader
            editor={editor}
            saveArticle={saveArticle}
            hasChanges={hasChanges}
            editing={editing}
            toggleEditMode={toggleEditMode}
          />
        )}

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
          <div className="flex flex-row gap-4 items-center justify-between">
            {editing ? (
              <div className="flex flex-col gap-2">
                <Label
                  className={cn(
                    'flex items-center gap-2',
                    getChangedFields().created_at
                      ? 'text-warning-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="w-4 h-4 font-bold" />
                  Date {getChangedFields().created_at && '*'}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-[280px] justify-start text-left font-normal',
                        !editForm.created_at && 'text-muted-foreground',
                      )}
                    >
                      {editForm.created_at ? (
                        format(new Date(editForm.created_at), 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(editForm.created_at)}
                      onSelect={(date) => {
                        setEditForm((prev) => ({
                          ...prev,
                          created_at: date?.toISOString() || prev.created_at,
                        }));
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <p className="text-muted-foreground font-medium text-lg">
                {format(new Date(article.created_at), 'eeee, dd MMMM yyyy')}
              </p>
            )}
          </div>

          {/* Departments, Title and Description */}
          <div className="flex flex-col gap-6">
            {editing ? (
              <div className="flex flex-col gap-4">
                <Label
                  className={cn(
                    'flex items-center gap-2',
                    getChangedFields().departments
                      ? 'text-warning-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  <Component className="w-4 h-4 font-bold" />
                  Departments {getChangedFields().departments && '*'}
                </Label>
                <div className="w-fit">
                  <ArticleDepartmentSelector
                    selectedDepartments={editForm.departments} // This now passes IDs
                    onChange={(departmentIds) => {
                      setEditForm((prev) => ({ ...prev, departments: departmentIds }));
                    }}
                  />
                </div>
                <div className="flex flex-row gap-8">
                  {departments
                    ?.filter((dept) => editForm.departments.includes(dept.id))
                    .map((department) => (
                      <DepartmentBadge
                        key={department.id}
                        department={department.department_name}
                        list
                        size="large"
                      />
                    ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-row gap-8">
                {article.departments.map((department) => (
                  <DepartmentBadge
                    key={department.id}
                    department={department.name}
                    list
                    size="large"
                  />
                ))}
              </div>
            )}

            <div className="flex flex-col gap-0">
              {editing ? (
                <div className="flex flex-col gap-6">
                  <div>
                    <Label
                      className={cn(
                        'flex items-center gap-2',
                        getChangedFields().title
                          ? 'text-warning-foreground'
                          : 'text-muted-foreground',
                      )}
                    >
                      <Heading1 className="w-4 h-4 font-bold" />
                      Title {getChangedFields().title && '*'}
                    </Label>
                    <Textarea
                      value={editForm.title}
                      onChange={(e) => {
                        setEditForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }));
                      }}
                      className="text-5xl font-bold mb-3 overflow-hidden"
                      placeholder="Article title..."
                      rows={calculateTitleRows(editForm.title)}
                      style={{
                        padding: '0.5rem 0',
                        border: 'none',
                        background: 'transparent',
                        minHeight: 'unset',
                        height: 'auto',
                      }}
                    />
                  </div>
                  <div>
                    <Label
                      className={cn(
                        'flex items-center gap-2',
                        getChangedFields().description
                          ? 'text-warning-foreground'
                          : 'text-muted-foreground',
                      )}
                    >
                      <Heading2 className="w-4 h-4 font-bold" />
                      Description {getChangedFields().description && '*'}
                    </Label>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => {
                        setEditForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }));
                      }}
                      className="text-xl text-muted-foreground"
                      placeholder="Article description..."
                      rows={calculateDescriptionRows(editForm.description)}
                      style={{
                        padding: '0.5rem 0',
                        border: 'none',
                        background: 'transparent',
                        minHeight: 'unset',
                        height: 'auto',
                      }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-5xl font-bold">{article.title}</h1>
                  <p className="mt-3 text-xl text-muted-foreground">
                    {article.description}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Authors */}

          {editing ? (
            <div className="flex gap-4 w-2/3">
              <div className="w-full flex flex-col gap-2">
                <Label
                  className={cn(
                    'flex items-center gap-1',
                    getChangedFields().authors
                      ? 'text-warning-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  <User className="w-4 h-4" />
                  Primary Author {getChangedFields().authors && '*'}
                </Label>
                <UserCombobox
                  selectedUserId={editForm.author_id}
                  onChange={(userId) => {
                    setEditForm((prev) => ({
                      ...prev,
                      author_id: userId,
                    }));
                  }}
                  placeholder="Select primary author..."
                  excludeUserIds={
                    [editForm.author_id_secondary, editForm.author_id_tertiary].filter(
                      Boolean,
                    ) as string[]
                  }
                />
              </div>

              <div className="w-full flex flex-col gap-2">
                <Label className="flex items-center gap-1 text-muted-foreground">
                  <User className="w-4 h-4" />
                  Secondary Author
                </Label>
                <UserCombobox
                  selectedUserId={editForm.author_id_secondary}
                  onChange={(userId) => {
                    setEditForm((prev) => ({
                      ...prev,
                      author_secondary_id: userId,
                    }));
                  }}
                  placeholder="Select secondary author..."
                  excludeUserIds={
                    [editForm.author_id, editForm.author_id_tertiary].filter(
                      Boolean,
                    ) as string[]
                  }
                />
              </div>

              <div className="w-full flex flex-col gap-2">
                <Label className="flex items-center gap-1 text-muted-foreground">
                  <User className="w-4 h-4" />
                  Tertiary Author
                </Label>
                <UserCombobox
                  selectedUserId={editForm.author_id_tertiary}
                  onChange={(userId) => {
                    setEditForm((prev) => ({
                      ...prev,
                      author_tertiary_id: userId,
                    }));
                  }}
                  placeholder="Select tertiary author..."
                  excludeUserIds={
                    [editForm.author_id, editForm.author_id_secondary].filter(
                      Boolean,
                    ) as string[]
                  }
                />
              </div>
            </div>
          ) : (
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
          )}

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
                console.log('Share');
              }}
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <Separator className="my-12" />

        <BlockEditor editing={editing} editor={editor} />

        <Separator className="my-12" />

        <CommentSection
          ref={commentSectionRef}
          entity_id={articleId}
          entity_type="article"
          setCommentNumber={setCommentNumber}
          commentNumber={commentNumber}
        />
      </main>
    </div>
  );
}
