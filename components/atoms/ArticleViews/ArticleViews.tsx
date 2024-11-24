import React from 'react';
import { Article } from '@/types/articleTypes';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserProfileCard } from '@/components/molecules/UserProfileCard/UserProfileCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactTimeAgo from 'react-time-ago';
import { useArticleViewers } from '@/queries/articles/hooks';
import CountUp from 'react-countup';

const ArticleViews = ({ article }: { article: Article }) => {
  const { data: viewers } = useArticleViewers(article.id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 flex items-center">
          <Eye className="w-4 h-4" />
          <p className="text-sm">
            <CountUp
              end={article.views}
              duration={5}
              delay={2}
              useEasing
              smartEasingAmount={0.5}
              easingFn={(t, b, c, d) => {
                // Quartic easing in/out
                t /= d / 2;
                if (t < 1) return (c / 2) * t * t * t * t + b;
                t -= 2;
                return (-c / 2) * (t * t * t * t - 2) + b;
              }}
            />{' '}
            View{article.views !== 1 ? 's' : ''}
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center flex-row gap-2 text-muted-foreground">
            {viewers?.length ?? 0} Unique Viewer{viewers?.length !== 1 ? 's' : ''}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/75">
            Viewers who have viewed this article.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="flex flex-col gap-3 h-fit">
            {viewers?.map((viewer) => (
              <div
                key={viewer.id}
                className="flex items-center justify-between overflow-visible h-full group/viewer"
              >
                <div className="flex items-center gap-2">
                  <div className="text-xs text-muted group-hover/viewer:text-muted-foreground flex items-center gap-1 mt-1 min-w-8 transition-colors select-none">
                    <Eye className="h-3 w-3" />
                    <p className="font-bold">{viewer.view_count}</p>
                  </div>
                  <UserProfileCard
                    id={viewer.user_id ?? ''}
                    showName
                    showAvatar
                    variant="minimal"
                    avatarSize="xs"
                    textSize="sm"
                    avatarPopOut={false}
                  />
                </div>

                <p className="text-xs text-muted group-hover/viewer:text-muted-foreground transition-colors select-none">
                  <ReactTimeAgo date={new Date(viewer.last_viewed_at)} />
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleViews;
