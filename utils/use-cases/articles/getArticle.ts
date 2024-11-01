'use server';

import { getRawArticle } from '@/utils/supabase/articles/articles';
import { createServerClient } from '@/utils/supabase/server';

export const getArticle = async (articleId: number) => {
  let isAuthor = false;
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { article, error } = await getRawArticle(articleId);

  if (error) {
    console.error('Error fetching article:', error);
    return { article: null, isAuthor: false, error };
  }

  if (user && article) {
    isAuthor = [
      article.author_id,
      article.author_id_secondary,
      article.author_id_tertiary,
    ].includes(user.id);
  }

  return { article, isAuthor, error };
};
