import { createBrowserClient } from '@/utils/supabase/client';

export async function getArticle(articleId: number) {
  const supabase = createBrowserClient();

  const { data: article, error: articleError } = await supabase
    .from('articles')
    .select('*')
    .eq('id', articleId)
    .maybeSingle();

  if (articleError) throw new Error(articleError.message);

  return article;
}

export async function getArticleComments(articleId: number) {
  const supabase = createBrowserClient();

  const { data: comments, error: commentsError } = await supabase
    .from('article_comments')
    .select('*')
    .eq('article_id', articleId)
    .order('created_at', { ascending: true });

  if (commentsError) throw new Error(commentsError.message);

  // Transform deleted comments to show placeholder text
  const transformedComments = comments.map((comment) => ({
    ...comment,
    comment: comment.deleted ? 'This comment has been deleted.' : comment.comment,
  }));

  return transformedComments;
}

export async function getArticleCommentReactions(commentId: string) {
  const supabase = createBrowserClient();

  // First check if the comment is deleted
  const { data: comment, error: commentError } = await supabase
    .from('article_comments')
    .select('deleted')
    .eq('id', commentId)
    .single();

  if (commentError) throw new Error(commentError.message);

  // If comment is deleted, return empty array
  if (comment.deleted) {
    return [];
  }

  const { data: reactions, error: reactionsError } = await supabase
    .from('article_comment_reactions')
    .select()
    .eq('comment_id', commentId);

  if (reactionsError) throw new Error(reactionsError.message);

  return reactions;
}

export async function insertArticleComment(
  articleId: number,
  comment: string,
  replyingToId?: string,
) {
  const supabase = createBrowserClient();

  const { data: commentData, error: commentError } = await supabase
    .from('article_comments')
    .insert({
      article_id: articleId,
      comment: comment,
      parent_id: replyingToId ?? null,
    })
    .select()
    .single();

  if (commentError) throw new Error(commentError.message);

  return commentData;
}

export async function deleteArticleComment(commentId: string) {
  const supabase = createBrowserClient();

  console.log('Deleting comment:', commentId);

  const { data, error: deleteError } = await supabase
    .from('article_comments')
    .update({ deleted: true })
    .eq('id', commentId)
    .select();

  console.log('Deleted comment:', data);

  if (deleteError) throw new Error(deleteError.message);
}

export async function toggleArticleCommentReaction(
  commentId: string,
  reactionType: string,
  userId: string,
) {
  const supabase = createBrowserClient();

  console.log('Toggling reaction with:', { commentId, reactionType, userId });

  try {
    // First check if user has any reaction for this comment
    const { data: existing, error: checkError } = await supabase
      .from('article_comment_reactions')
      .select('*')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        // No existing reaction found, that's okay
        console.log('No existing reaction found');
      } else {
        console.error('Error checking for existing reaction:', checkError);
        throw new Error(checkError.message);
      }
    }

    if (existing) {
      console.log('Found existing reaction:', existing);
      if (existing.react_type === reactionType) {
        // If clicking the same reaction, delete it
        const { error: deleteError } = await supabase
          .from('article_comment_reactions')
          .delete()
          .eq('id', existing.id);

        if (deleteError) throw new Error(deleteError.message);
      } else {
        // If clicking a different reaction, update it
        const { error: updateError } = await supabase
          .from('article_comment_reactions')
          .update({ react_type: reactionType })
          .eq('id', existing.id);

        if (updateError) throw new Error(updateError.message);
      }
    } else {
      // If no existing reaction, insert new one
      console.log('Inserting new reaction');
      const { error: insertError } = await supabase
        .from('article_comment_reactions')
        .insert({
          comment_id: commentId,
          react_type: reactionType,
          user_id: userId,
        });

      if (insertError) throw new Error(insertError.message);
    }
  } catch (error) {
    console.error('Error in toggleArticleCommentReaction:', error);
    throw error;
  }
}
