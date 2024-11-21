import { createServerClient } from '@/utils/supabase/server';
import { ArticleComment } from './types';

export async function createArticleComment(
  articleId: number,
  comment: string,
  parentId?: string,
) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('article_comments')
    .insert({
      article_id: articleId,
      comment,
      parent_id: parentId ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as ArticleComment;
}

export async function toggleCommentReaction(commentId: string, reactionType: string) {
  const supabase = await createServerClient();

  // First check if reaction exists
  const { data: existing, error: checkError } = await supabase
    .from('article_comment_reactions')
    .select()
    .eq('comment_id', commentId)
    .eq('react_type', reactionType)
    .single();

  if (checkError && checkError.code !== 'PGRST116') throw new Error(checkError.message);

  if (existing) {
    // Remove existing reaction
    const { error: deleteError } = await supabase
      .from('article_comment_reactions')
      .delete()
      .eq('id', existing.id);

    if (deleteError) throw new Error(deleteError.message);
  } else {
    // Add new reaction
    const { error: insertError } = await supabase
      .from('article_comment_reactions')
      .insert({
        comment_id: commentId,
        react_type: reactionType,
      });

    if (insertError) throw new Error(insertError.message);
  }
}
