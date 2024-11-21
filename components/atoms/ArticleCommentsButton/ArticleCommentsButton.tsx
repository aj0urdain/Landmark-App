import React from 'react';
import { Article } from '@/types/articleTypes';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useArticleComments } from '@/queries/articles/hooks';

const ArticleCommentsButton = ({
  article,
  commentSectionRef,
}: {
  article: Article;
  commentSectionRef: React.RefObject<HTMLDivElement>;
}) => {
  const { data: comments } = useArticleComments(article.id);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 flex items-center"
      onClick={() => {
        commentSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start',
        });
      }}
    >
      <MessageCircle className="w-4 h-4" />
      <span className="text-sm">
        {comments?.length} Comment{comments?.length != 1 ? 's' : ''}
      </span>
    </Button>
  );
};

export default ArticleCommentsButton;
