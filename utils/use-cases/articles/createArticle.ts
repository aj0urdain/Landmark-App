'use server';

import { createServerClient } from '@/utils/supabase/server';

export const createArticle = async (type: string) => {
  const supabase = await createServerClient();

  const { data, error } = await supabase.rpc('create_new_article', {
    type,
  });

  if (error) {
    console.error('Error creating article:', error);
    throw error;
  }

  return data;
};
