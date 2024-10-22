import { EditorInfo } from './EditorInfo';

import { useEditorState } from '@tiptap/react';
import { Button } from '@/components/ui/button';

export interface EditorHeaderProps {
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
  editor: any;
  saveArticle: (content: any) => Promise<void>;
}

export const EditorHeader = ({
  editor,
  isSidebarOpen,
  toggleSidebar,
  saveArticle,
}: EditorHeaderProps) => {
  const { characters, words } = useEditorState({
    editor,
    selector: (ctx): { characters: number; words: number } => {
      const { characters, words } = ctx.editor?.storage.characterCount || {
        characters: () => 0,
        words: () => 0,
      };
      return { characters: characters(), words: words() };
    },
  });

  return (
    <div className="flex flex-row py-4 items-center px-12 w-full justify-between text-foreground bg-muted/20 border-b border-muted-foreground/50">
      <Button
        variant="outline"
        size="lg"
        onClick={() => {
          void saveArticle(editor.getJSON());
        }}
      >
        Save Article
      </Button>
      <div className="flex flex-row items-center gap-4">
        <EditorInfo characters={characters} words={words} />
      </div>
    </div>
  );
};
