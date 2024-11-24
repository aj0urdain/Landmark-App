import React from 'react';
import { Article } from '@/types/articleTypes';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useArticleComments } from '@/queries/articles/hooks';
import CountUp from 'react-countup';

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
      <p className="text-sm">
        <CountUp
          end={comments?.length ?? 0}
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
        Comment{comments?.length !== 1 ? 's' : ''}
      </p>
    </Button>
  );
};

export default ArticleCommentsButton;
