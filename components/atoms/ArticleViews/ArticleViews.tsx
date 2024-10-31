import React from 'react';
import { Article } from '@/types/articleTypes';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserProfileCard } from '@/components/molecules/UserProfileCard/UserProfileCard';
import { ScrollArea } from '@/components/ui/scroll-area';

const ArticleViews = ({ article }: { article: Article }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 flex items-center">
          <Eye className="w-4 h-4" />
          <span className="text-sm">
            {article.views} View{article.views != 1 ? 's' : ''}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-muted-foreground">
            {article.viewers?.length} Unique Viewer
            {article.viewers?.length != 1 ? 's' : ''}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md">
          <div className="space-y-4 p-4">
            {article.viewers?.map((viewer) => (
              <UserProfileCard
                key={viewer.id}
                id={viewer.id}
                showAvatar
                variant="minimal"
                showName
                showRoles
                avatarSize="small"
                showHoverCard={false}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleViews;
