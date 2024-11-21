import ArticleCommentsButton from '@/components/atoms/ArticleCommentsButton/ArticleCommentsButton';
import ArticleShareButton from '@/components/atoms/ArticleShareButton/ArticleShareButton';
import ArticleViews from '@/components/atoms/ArticleViews/ArticleViews';
import { Article } from '@/types/articleTypes';
import React from 'react';
import { Editor } from '@tiptap/react';
import ArticleReadTime from '@/components/atoms/ArticleReadTime/ArticleReadTime';
import { Dot } from '@/components/atoms/Dot/Dot';

const ArticleActions = ({
  article,
  editing,
  commentSectionRef,
  editor,
}: {
  article: Article;
  editing: boolean;
  commentSectionRef: React.RefObject<HTMLDivElement>;
  editor: Editor;
}) => {
  return (
    <div className="flex flex-row gap-4 items-center text-muted-foreground">
      <ArticleReadTime editor={editor} article={article} />
      <Dot size="small" className="bg-muted-foreground" />
      <div className="flex flex-row gap-2">
        <ArticleViews article={article} />
        <ArticleCommentsButton article={article} commentSectionRef={commentSectionRef} />
        <ArticleShareButton article={article} editing={editing} />
      </div>
    </div>
  );
};

export default ArticleActions;
