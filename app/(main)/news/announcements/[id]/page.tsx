'use client';

import { useMemo } from 'react';
import { Doc as YDoc } from 'yjs';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { BlockEditor } from '@/components/atoms/TipTap/components/BlockEditor';
import { createBrowserClient } from '@/utils/supabase/client';
import { Content } from '@tiptap/core';

export default function AnnouncementArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  const supabase = createBrowserClient();
  const queryClient = useQueryClient();

  const ydoc = useMemo(() => new YDoc(), []);

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_article_with_details', { article_id: parseInt(articleId) })
        .single();

      if (error) throw error;

      console.log(data);
      return data;
    },
  });

  // Save article mutation
  const saveArticleMutation = useMutation({
    mutationFn: async (content: any) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('articles')
        .upsert({
          content: content as Content,
        })
        .eq('id', articleId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['article', articleId] });
    },
  });

  const saveArticle = async (content: any) => {
    try {
      await saveArticleMutation.mutateAsync(content);
      console.log('Article saved successfully');
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <BlockEditor
        ydoc={ydoc}
        canEdit={true}
        saveArticle={saveArticle}
        article={article}
      />
    </div>
  );
}
