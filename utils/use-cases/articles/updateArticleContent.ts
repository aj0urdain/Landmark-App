import { patchArticleContent } from '@/utils/supabase/articles/articles';

export const updateArticleContent = async (
  articleId: number,
  content: Record<string, unknown>,
) => {
  console.log(`articleId: ${articleId.toString()}`);
  console.log(`content: ${JSON.stringify(content)}`);
  return await patchArticleContent(articleId, content);
};
