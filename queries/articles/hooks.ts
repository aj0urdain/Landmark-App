'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getArticleCommentReactions, getArticleComments } from './api';

export const articleKeys = {
  all: ['articles'] as const,
  comments: (articleId: number) => [...articleKeys.all, 'comments', articleId] as const,
  commentReactions: (commentId: string) =>
    [...articleKeys.all, 'commentReactions', commentId] as const,
};

export function useArticleComments(articleId: number) {
  return useQuery({
    queryKey: articleKeys.comments(articleId),
    queryFn: () => getArticleComments(articleId),
  });
}

export function invalidateArticleComments(articleId: number) {
  console.log(`attempting to invalidate article comments for ${String(articleId)}`);
  const queryClient = useQueryClient();
  return queryClient.invalidateQueries({ queryKey: articleKeys.comments(articleId) });
}

export function useArticleCommentReactions(commentId: string) {
  return useQuery({
    queryKey: articleKeys.commentReactions(commentId),
    queryFn: () => getArticleCommentReactions(commentId),
  });
}
