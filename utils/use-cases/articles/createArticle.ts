'use server';

import { createServerClient } from '@/utils/supabase/server';

export const createArticle = async (type: string) => {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('articles')
    .insert({
      article_type: type,
      reactions: [],
      cover_image:
        'https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/user_uploads/e2570807-6d18-4f80-921c-f66fa4d8b76a/lmbg-e2570807-6d18-4f80-921c-f66fa4d8b76a.webp',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating article:', error);
    throw error;
  }

  return data;
};
