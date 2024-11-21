export interface ArticleComment {
  id: string;
  article_id: number;
  comment: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  edit_history: Record<string, unknown> | null;
  parent_id: string | null;
  deleted: boolean;
}

export interface ArticleCommentReaction {
  id: number;
  react_type: string;
  user_id: string;
  comment_id: string;
  created_at: string;
}

export interface ArticleReaction {
  id: number;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

export interface CommentWithReactions extends ArticleComment {
  reactions: ArticleCommentReaction[];
  replies?: CommentWithReactions[];
  replyingToId?: string;
}
