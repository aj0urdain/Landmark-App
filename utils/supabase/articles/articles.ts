'use server';

import { Article } from '@/types/articleTypes';
import { createServerClient } from '@/utils/supabase/server';

export const getArticleWithDetails = async (articleId: number) => {
  const supabase = await createServerClient();

  const { data: article, error } = (await supabase.rpc('get_article_with_details', {
    article_id: articleId,
  })) as { data: Article | null; error: unknown };

  if (error) {
    console.error('Error fetching article:', error);
    return { article: null, error };
  }

  return { article, error };
};

export const patchArticleContent = async (
  articleId: number,
  content: Record<string, unknown>,
) => {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('articles')
    .update({ content })
    .eq('id', articleId);

  return { data, error };
};

export const createArticle = async (articleType: string) => {
  const supabase = await createServerClient();

  const { data, error } = await supabase.from('articles').insert({
    type: articleType,
  });

  return { data, error };
};
