import React from 'react';
import { Article } from '@/types/articleTypes';
import { Share } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const ArticleShareButton = ({
  article,
  editing,
}: {
  article: Article;
  editing: boolean;
}) => {
  return (
    <Button variant="ghost" size="sm" className="gap-2 flex items-center">
      <Share className="w-4 h-4" />
      <span className="text-sm">Share</span>
    </Button>
  );
};

export default ArticleShareButton;
