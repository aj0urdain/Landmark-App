'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { BlockEditor } from '@/components/atoms/TipTap/components/BlockEditor';
import { EditorHeader } from '@/components/atoms/TipTap/components/BlockEditor/components/EditorHeader';
import { useBlockEditor } from '@/components/atoms/TipTap/hooks/useBlockEditor';
import { Separator } from '@/components/ui/separator';
import { getArticle } from '@/utils/use-cases/articles/getArticle';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { debounce } from 'lodash';
import { updateArticleContent } from '@/utils/use-cases/articles/updateArticleContent';
import { LoaderCircle } from 'lucide-react';

import ArticleCoverImage from '@/components/atoms/ArticleCoverImage/ArticleCoverImage';
import ArticleDate from '@/components/atoms/ArticleDate/ArticleDate';
import ArticleDepartments from '@/components/atoms/ArticleDepartments/ArticleDepartments';
import ArticleDescription from '@/components/atoms/ArticleDescription/ArticleDescription';
import ArticleReactions from '@/components/atoms/ArticleReactions/ArticleReactions';
import ArticleTitle from '@/components/atoms/ArticleTitle/ArticleTitle';
import ArticleActions from '@/components/molecules/ArticleActions/ArticleActions';
import ArticleAuthors from '@/components/molecules/ArticleAuthors/ArticleAuthors';
import ArticlePublic from '@/components/atoms/ArticlePublic/ArticlePublic';
import ArticleAuthorisation from '@/components/atoms/ArticleAuthorisation/ArticleAuthorisation';
import CommentSection from '@/components/organisms/CommentSection/CommentSection';
import { useIncrementArticleView } from '@/queries/articles/hooks';

const ArticleDisplay = ({ articleId }: { articleId: string }) => {
  const [editing, setEditing] = useState(false);
  const incrementViewMutation = useIncrementArticleView();

  const commentSectionRef = useRef<HTMLDivElement>(null);
  const articleTitleRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Increment view count when page loads
    incrementViewMutation.mutate(articleId as unknown as number);
  }, [articleId]);

  const { data, isLoading } = useQuery({
    queryKey: ['article', articleId],
    queryFn: async () => {
      const { article, isAuthor, error } = await getArticle(parseInt(articleId));

      if (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error(String(error));
      }

      console.log(`article content for article title ${String(article?.title)}`);
      console.log(article?.content);

      return { article, isAuthor };
    },
  });

  const { editor } = useBlockEditor({
    editing,
    initialContent: data?.article?.content ?? null,
    enabled: true,
  });

  const { mutateAsync: updateContent } = useMutation({
    mutationFn: (content: Record<string, unknown>) =>
      updateArticleContent(
        parseInt(articleId),
        JSON.parse(JSON.stringify(content)) as Record<string, unknown>,
      ),
    onError: () => {
      toast({
        title: 'Error saving changes',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: async () => {
      toast({
        title: 'Changes saved',
        description: 'Your article has been updated successfully.',
      });
      // Invalidate without resetting editor state
      await queryClient.invalidateQueries({
        queryKey: ['article', articleId],
        refetchType: 'none', // Prevent automatic refetch
      });
    },
  });

  const debouncedSave = useMemo(
    () =>
      debounce((content: Record<string, unknown>) => {
        const plainContent = JSON.parse(JSON.stringify(content)) as Record<
          string,
          unknown
        >;
        void updateContent(plainContent);
      }, 2000),
    [updateContent],
  );

  useEffect(() => {
    if (editing) {
      const handleUpdate = () => {
        const content = editor.getJSON();
        if (Object.keys(content).length > 0) {
          debouncedSave(content);
        }
      };

      editor.on('update', handleUpdate);
      return () => {
        editor.off('update', handleUpdate);
        debouncedSave.cancel();
      };
    }
  }, [editor, editing, debouncedSave]);

  // Add this effect after the content loads
  useEffect(() => {
    if (!isLoading && articleTitleRef.current) {
      setTimeout(() => {
        articleTitleRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100); // Small delay to ensure content is rendered
    }
  }, [isLoading]);

  if (isLoading)
    return (
      <div className="flex items-start justify-center min-h-screen py-2 max-w-4xl w-full mx-auto animate-pulse">
        <LoaderCircle className="animate-spin" />
      </div>
    );

  // If there's no data or no article, show an error or return early
  if (!data?.article) {
    return <div>Article not found</div>;
  }

  const { article, isAuthor } = data;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 max-w-4xl w-full mx-auto">
      {isAuthor && (
        <EditorHeader
          editor={editor}
          editing={editing}
          setEditing={setEditing}
          article={article}
        />
      )}

      <div className="flex flex-col gap-16">
        <div className="animate-slide-down-fade-in opacity-0 [animation-delay:_0.75s] [animation-duration:_4s] [animation-fill-mode:_forwards]">
          <ArticleCoverImage article={article} editing={editing} />
        </div>
        <div className="flex flex-col gap-12 -mt-14 z-10">
          <div className="animate-slide-left-fade-in opacity-0 flex items-center gap-2 justify-between [animation-delay:_0s] [animation-duration:_2s] [animation-fill-mode:_forwards]">
            <ArticleDate article={article} editing={editing} />
            {editing && (
              <div className="flex flex-col items-end gap-4 mt-6">
                <ArticlePublic article={article} editing={editing} />
                {/* <Dot size="small" className="bg-muted-foreground animate-pulse" /> */}
                <ArticleAuthorisation article={article} editing={editing} />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-6">
                <div className="animate-slide-left-fade-in opacity-0 [animation-delay:_0.25s] [animation-duration:_2s] [animation-fill-mode:_forwards]">
                  <ArticleDepartments article={article} editing={editing} />
                </div>
                <div className="flex flex-col gap-2">
                  <div
                    ref={articleTitleRef}
                    className="animate-slide-left-fade-in opacity-0 [animation-delay:_0.75s] [animation-duration:_2s] [animation-fill-mode:_forwards]"
                  >
                    <ArticleTitle article={article} editing={editing} />
                  </div>
                  <div className="animate-slide-left-fade-in opacity-0 [animation-delay:_0.75s] [animation-duration:_2s] [animation-fill-mode:_forwards]">
                    <ArticleDescription article={article} editing={editing} />
                  </div>
                </div>
              </div>

              <div className="animate-slide-left-fade-in opacity-0 [animation-delay:_1s] [animation-duration:_2s] [animation-fill-mode:_forwards]">
                <ArticleAuthors article={article} editing={editing} />
              </div>
              <div className="animate-slide-left-fade-in opacity-0 [animation-delay:_1.25s] [animation-duration:_2s] [animation-fill-mode:_forwards]">
                <ArticleActions
                  article={article}
                  editing={editing}
                  commentSectionRef={commentSectionRef}
                  editor={editor}
                />
              </div>
            </div>
          </div>
        </div>
        <Separator className="w-full -my-6" />
        <div className="animate-slide-down-fade-in opacity-0 [animation-delay:_2s] [animation-duration:_2s] [animation-fill-mode:_forwards]">
          <BlockEditor editing={editing} editor={editor} />
        </div>
        <Separator className="w-full -my-6" />
        <div className="animate-slide-left-fade-in opacity-0 [animation-delay:_2.5s] [animation-duration:_2s] [animation-fill-mode:_forwards]">
          <ArticleReactions articleId={parseInt(articleId)} />
        </div>

        <div
          className="animate-slide-left-fade-in opacity-0 [animation-delay:_2.5s] [animation-duration:_2s] [animation-fill-mode:_forwards]"
          ref={commentSectionRef}
        >
          <CommentSection articleId={parseInt(articleId)} />
        </div>
      </div>
    </div>
  );
};

export default ArticleDisplay;
