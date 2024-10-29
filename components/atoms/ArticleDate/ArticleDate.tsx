import { Article } from '@/types/articleTypes';
import { format } from 'date-fns';

import React from 'react';

const ArticleDate = ({ article, editing }: { article: Article; editing: boolean }) => {
  return (
    <div className="flex flex-row gap-4 items-center justify-between">
      <p className="text-muted-foreground font-medium text-sm uppercase tracking-wide">
        {format(new Date(article.created_at), 'eeee, dd MMMM yyyy')}
      </p>
    </div>
  );
};

export default ArticleDate;
