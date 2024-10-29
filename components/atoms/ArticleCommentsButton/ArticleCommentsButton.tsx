import React from 'react';
import { Article } from '@/types/articleTypes';
import { Button } from '@/components/ui/Button';
import { MessageCircle } from 'lucide-react';

const ArticleCommentsButton = ({
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
        {commentNumber} Comment{commentNumber != 1 ? 's' : ''}
      </span>
    </Button>
  );
};

export default ArticleCommentsButton;
