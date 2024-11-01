// types.ts
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

export interface Reaction {
  type: 'like' | 'love' | 'laugh' | 'fire' | 'sad';
  user_id: string;
  react_time: string;
}

export interface Comment {
  id: string;
  comment: string;
  created_at: string;
  created_by: User;
  reactions: Reaction[];
}

export interface EditFormState {
  title: string;
  description: string;
  departments: number[];
  created_at: string;
  author_id: string;
  author_id_secondary: string | null;
  author_id_tertiary: string | null;
}

export interface Department {
  id: number;
  name: string;
}

export interface Article {
  id: number;
  article_type: string;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
  author_id: string;
  author_id_secondary: string | null;
  author_id_tertiary: string | null;
  title: string;
  description: string;
  content: {
    type: string;
    content: Record<string, unknown>[];
  };
  views: number;
  viewer_ids: string[];
  departments: number[];
  reactions: Record<string, Reaction[]>;
  public: boolean;
}
