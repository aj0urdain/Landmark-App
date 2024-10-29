import React from 'react';
import { Article } from '@/types/articleTypes';
import { Button } from '@/components/ui/Button';
import { Eye } from 'lucide-react';

const ArticleViews = ({ article, editing }: { article: Article; editing: boolean }) => {
  return (
    <Button variant="ghost" size="sm" className="gap-2 flex items-center">
      <Eye className="w-4 h-4" />
      <span className="text-sm">
        {article.views} View{article.views != 1 ? 's' : ''}
      </span>
    </Button>
  );
};

export default ArticleViews;
