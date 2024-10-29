import ArticleCommentsButton from '@/components/atoms/ArticleCommentsButton/ArticleCommentsButton';
import ArticleReactions from '@/components/atoms/ArticleReactions/ArticleReactions';
import ArticleShareButton from '@/components/atoms/ArticleShareButton/ArticleShareButton';
import ArticleViews from '@/components/atoms/ArticleViews/ArticleViews';
import { Article } from '@/types/articleTypes';
import React from 'react';

const ArticleActions = ({
  article,
  editing,
  commentNumber,
  commentSectionRef,
}: {
  article: Article;
  editing: boolean;
  commentNumber: number;
  commentSectionRef: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div className="flex flex-row gap-2 text-muted-foreground">
      <ArticleViews article={article} editing={editing} />
      <ArticleCommentsButton
        article={article}
        editing={editing}
        commentNumber={commentNumber}
        commentSectionRef={commentSectionRef}
      />
      <ArticleShareButton article={article} editing={editing} />
    </div>
  );
};

export default ArticleActions;
