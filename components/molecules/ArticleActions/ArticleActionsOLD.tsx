import { Button } from '@/components/ui/Button';
import { Eye, MessageCircle, Share } from 'lucide-react';

interface ArticleActionsProps {
  views: number;
  commentCount: number;
  onScrollToComments: () => void;
}

export const ArticleActions = ({
  views,
  commentCount,
  onScrollToComments,
}: ArticleActionsProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4" />
        <span className="text-sm text-muted-foreground">{views} views</span>
      </div>
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={onScrollToComments}
      >
        <MessageCircle className="h-4 w-4" />
        <span className="text-sm">{commentCount} comments</span>
      </Button>
      <Button variant="ghost" className="flex items-center gap-2">
        <Share className="h-4 w-4" />
        <span className="text-sm">Share</span>
      </Button>
    </div>
  );
};
