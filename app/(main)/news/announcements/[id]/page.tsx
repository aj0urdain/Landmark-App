'use client';

import ArticleCoverImage from '@/components/atoms/ArticleCoverImage/ArticleCoverImage';
import ArticleDate from '@/components/atoms/ArticleDate/ArticleDate';
import ArticleDepartments from '@/components/atoms/ArticleDepartments/ArticleDepartments';
import ArticleDescription from '@/components/atoms/ArticleDescription/ArticleDescription';
import ArticleReactions from '@/components/atoms/ArticleReactions/ArticleReactions';
import ArticleTitle from '@/components/atoms/ArticleTitle/ArticleTitle';

import { BlockEditor } from '@/components/atoms/TipTap/components/BlockEditor';
import { EditorHeader } from '@/components/atoms/TipTap/components/BlockEditor/components/EditorHeader';
import { useBlockEditor } from '@/components/atoms/TipTap/hooks/useBlockEditor';
import ArticleActions from '@/components/molecules/ArticleActions/ArticleActions';
import ArticleAuthors from '@/components/molecules/ArticleAuthors/ArticleAuthors';
import { CommentSection } from '@/components/organisms/CommentSection/CommentSection';
import { Separator } from '@/components/ui/separator';
import { Article } from '@/types/articleTypes';
import { getArticle } from '@/utils/use-cases/articles/getArticle';
import { useQuery } from '@tanstack/react-query';
import { Content } from '@tiptap/react';
import { useParams } from 'next/navigation';
import React, { useMemo, useRef, useState } from 'react';
import { Doc as YDoc } from 'yjs';

const AnnouncementArticlePage = () => {
  const params = useParams();
  const articleId = params.id as string;
  const ydoc = useMemo(() => new YDoc(), []);
  const [editing, setEditing] = useState(false);
  const [commentNumber, setCommentNumber] = useState(0);

  const [editForm, setEditForm] = useState<unknown>({});

  const commentSectionRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['article', articleId],
    queryFn: async () => {
      return await getArticle(parseInt(articleId));
    },
  });

  const { editor } = useBlockEditor({
    ydoc,
    editing,
    initialContent: (data?.article?.content as Content) ?? {},
    enabled: !isLoading && !!data?.article?.content,
  });

  if (isLoading) return <div>Loading...</div>;

  const { article, isAuthor } = data ?? {};

  return (
    <div className="flex flex-col items-start justify-start min-h-screen py-2">
      {isAuthor && (
        <EditorHeader
          editor={editor}
          // saveArticle={saveArticle}
          // hasChanges={hasChanges}
          editing={editing}
          toggleEditMode={() => {
            setEditing((prev) => !prev);
          }}
        />
      )}

      <div className="flex flex-col gap-16">
        <ArticleCoverImage article={article ?? ({} as Article)} editing={editing} />
        <div className="flex flex-col gap-12">
          <ArticleDate article={article ?? ({} as Article)} editing={editing} />
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              <ArticleDepartments
                article={article ?? ({} as Article)}
                editing={editing}
              />
              <div className="flex flex-col gap-4">
                <ArticleTitle article={article ?? ({} as Article)} editing={editing} />
                <ArticleDescription
                  article={article ?? ({} as Article)}
                  editing={editing}
                />
              </div>
            </div>

            <ArticleAuthors article={article ?? ({} as Article)} editing={editing} />

            <ArticleActions
              article={article ?? ({} as Article)}
              editing={editing}
              commentNumber={commentNumber}
              commentSectionRef={commentSectionRef}
            />
          </div>
        </div>
      </div>
      <Separator className="my-12" />
      {article?.content && <BlockEditor editing={editing} editor={editor} />}
      <Separator className="mb-12" />
      <ArticleReactions article={article ?? ({} as Article)} editing={editing} />
      <Separator className="my-12" />

      <CommentSection
        ref={commentSectionRef}
        entity_id={articleId}
        entity_type="article"
        setCommentNumber={setCommentNumber}
        commentNumber={commentNumber}
      />
    </div>
  );
};

export default AnnouncementArticlePage;
