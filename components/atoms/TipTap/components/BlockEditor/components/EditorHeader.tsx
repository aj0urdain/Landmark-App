import { EditorInfo } from './EditorInfo';

import { Editor, useEditorState } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { CircleX, Pencil } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Article } from '@/types/articleTypes';

export interface EditorHeaderProps {
  editor: Editor;
  setEditing: (editing: boolean) => void;
  editing: boolean;
  article: Article;
}

export const EditorHeader = ({
  editor,
  editing,
  setEditing,
  article,
}: EditorHeaderProps) => {
  const queryClient = useQueryClient();

  const { characters, words } = useEditorState({
    editor,
    selector: (ctx): { characters: number; words: number } => {
      const { characters, words } = ctx.editor.storage.characterCount as {
        characters: () => number;
        words: () => number;
      };
      return { characters: characters(), words: words() };
    },
  });

  const toggleEditMode = () => {
    setEditing(!editing);
    // If we're exiting edit mode, revalidate the query
    if (editing) {
      void queryClient.invalidateQueries({
        queryKey: ['article', article.id.toString()],
      });
    }
  };

  return (
    <div
      className={`flex flex-row py-4 items-center z-50 px-12 w-full justify-between text-foreground ${editing ? 'bg-warning-foreground/20 border-warning-foreground' : 'bg-muted/20 border-muted-foreground/50'} border-b backdrop-blur-2xl sticky top-20 animate-slide-down-fade-in opacity-0 [animation-delay:_2s] [animation-duration:_2s] [animation-fill-mode:_forwards]`}
    >
      <div className="flex flex-row gap-4 items-center">
        <Button
          variant={editing ? 'destructive' : 'default'}
          onClick={toggleEditMode}
          className={`text-sm flex gap-1 border items-center ${editing ? 'border-warning-foreground bg-warning-foreground/50 text-foreground hover:bg-warning-foreground/20 hover:text-warning-foreground' : 'border-muted-foreground/50 text-muted'}`}
        >
          {editing ? <CircleX className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
          {editing ? 'Exit Editing' : 'Edit'}
        </Button>
      </div>

      <div className="flex flex-row items-center gap-4">
        <EditorInfo characters={characters} words={words} />
      </div>
    </div>
  );
};
