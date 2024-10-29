'use server';

import { Article } from '@/types/articleTypes';
import { createServerClient } from '@/utils/supabase/server';

export const getArticleWithDetails = async (articleId: number) => {
  const supabase = await createServerClient();

  const { data: article, error } = (await supabase.rpc('get_article_with_details', {
    article_id: articleId,
  })) as { data: Article | null; error: unknown };

  console.log(article);

  if (error) {
    console.error('Error fetching article:', error);
    return null;
  }

  return article;
};
