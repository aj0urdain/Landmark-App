import Image from 'next/image';
import React from 'react';
import { Article } from '@/types/articleTypes';

const ArticleCoverImage = ({
  article,
  editing,
}: {
  article: Article;
  editing: boolean;
}) => {
  return (
    <div className="relative flex min-h-[30rem] items-end justify-start overflow-hidden rounded-3xl">
      <Image
        src={article.cover_image ?? ''}
        alt={article.title}
        width={1000}
        height={1000}
        className="absolute left-0 top-0 h-full w-full object-cover object-bottom opacity-100"
      />
      <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-background/10 via-background/75 to-background"></div>
    </div>
  );
};

export default ArticleCoverImage;
