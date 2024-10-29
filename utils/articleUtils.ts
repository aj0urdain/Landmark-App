import { Article } from '@/types/articleTypes';

// utils.ts
export const calculateTitleRows = (text: string) => {
  const lineBreaks = (text.match(/\n/g) ?? []).length;
  const charsPerLine = 40;
  const estimatedLines = Math.ceil(text.length / charsPerLine);
  return Math.max(lineBreaks + 1, estimatedLines, 1);
};

export const calculateDescriptionRows = (text: string) => {
  const lineBreaks = (text.match(/\n/g) ?? []).length;
  const charsPerLine = 50;
  const estimatedLines = Math.ceil(text.length / charsPerLine);
  return Math.max(lineBreaks + 1, estimatedLines, 1);
};

export function getChangedFields(article: Article | null, editForm: unknown) {
  if (!article) return {};

  return {
    title: editForm?.title !== article.title,
    description: editForm?.description !== article.description,
    departments:
      JSON.stringify(editForm?.departments.sort()) !==
      JSON.stringify(article.departments.map((d) => d.id).sort()),
    created_at: editForm?.created_at !== article.created_at,
    authors:
      editForm?.author_id !== article.author.id ||
      editForm?.author_id_secondary !== article.author_secondary?.id ||
      editForm?.author_id_tertiary !== article.author_tertiary?.id,
  };
}
