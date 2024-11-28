'use client';

import ArticleDisplay from '@/components/organisms/ArticleDisplay/ArticleDisplay';

import { useParams } from 'next/navigation';

const SpotlightArticlePage = () => {
  const params = useParams();
  const articleId = params.id as string;

  return <ArticleDisplay articleId={articleId} />;
};

export default SpotlightArticlePage;
