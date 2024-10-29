import { EditorInfo } from './EditorInfo';

import { Content, Editor, useEditorState } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CircleX, Cross, Pencil } from 'lucide-react';

export interface EditorHeaderProps {
  editor: Editor;
  saveArticle: (content: Content) => void;
  hasChanges: boolean;
  editing: boolean;
  toggleEditMode: () => void;
}

export const EditorHeader = ({
  editor,
  saveArticle,
  hasChanges,
  editing,
  toggleEditMode,
}: EditorHeaderProps) => {
  const { characters, words } = useEditorState({
    editor,
    selector: (ctx): { characters: number; words: number } => {
      const { characters, words } = (ctx.editor.storage.characterCount as {
        characters: () => number;
        words: () => number;
      }) ?? {
        characters: () => 0,
        words: () => 0,
      };
      return { characters: characters(), words: words() };
    },
  });

  return (
    <div
      className={`flex flex-row py-4 items-center z-50 px-12 w-full justify-between text-foreground ${editing ? 'bg-warning-foreground/20 border-warning-foreground' : 'bg-muted/20 border-muted-foreground/50'} border-b  backdrop-blur-2xl sticky top-20`}
    >
      <div className="flex flex-row gap-4 items-center">
        <Button
          variant={editing ? 'destructive' : 'default'}
          onClick={toggleEditMode}
          className="text-sm flex gap-2 items-center"
        >
          {editing ? <CircleX className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          {editing ? 'Exit Editing' : 'Edit'}
        </Button>
        {editing && (
          <Button
            onClick={() => {
              saveArticle(editor.getJSON());
            }}
            className={cn(
              hasChanges && 'bg-warning-foreground hover:bg-warning-foreground/90',
            )}
          >
            Save Article
          </Button>
        )}
      </div>

      <div className="flex flex-row items-center gap-4">
        <EditorInfo characters={characters} words={words} />
      </div>
    </div>
  );
};
