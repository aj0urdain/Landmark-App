export interface User {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

export interface Reaction {
  user_id: string;
  react_time: string;
  user: User;
}

export interface Comment {
  id: string;
  comment: string;
  created_at: string;
  created_by: User;
  parent_id: string | null;
  reactions: Reaction[] | null;
  replies?: Comment[];
  parentComment?: Comment | null;
}

export interface CommentSectionProps {
  entity_id: string;
  entity_type: string;
  setCommentNumber: (number: number) => void;
  commentNumber: number;
}
