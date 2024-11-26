'use client';

import ArticleDisplay from '@/components/organisms/ArticleDisplay/ArticleDisplay';

import { useParams } from 'next/navigation';

const AnnouncementArticlePage = () => {
  const params = useParams();
  const articleId = params.id as string;

  return <ArticleDisplay articleId={articleId} />;

  // Need to add further filters (branch, team, department)
};

export default AnnouncementArticlePage;
