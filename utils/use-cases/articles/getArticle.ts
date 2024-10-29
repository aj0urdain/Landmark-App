'use server';

import { getArticleWithDetails } from '@/utils/supabase/articles/articles';
import { createServerClient } from '@/utils/supabase/server';

export const getArticle = async (articleId: number) => {
  let isAuthor = false;
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const article = await getArticleWithDetails(articleId);

  if (user && article) {
    isAuthor = [
      article.author.id,
      article.author_secondary?.id,
      article.author_tertiary?.id,
    ].includes(user.id);
  }

  return { article, isAuthor };
};
