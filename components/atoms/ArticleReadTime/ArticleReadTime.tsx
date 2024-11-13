import React from 'react';
import { Editor, useEditorState } from '@tiptap/react';
import { Article } from '@/types/articleTypes';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ArticleReadTime = ({ editor, article }: { editor: Editor; article: Article }) => {
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

  const readTime = Math.ceil(words / 238);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger>
          <p className="text-sm animated-underline-1 select-none">
            <span className="font-bold">{readTime}</span> minute read
          </p>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={10}
          className="flex gap-2 items-center bg-muted text-muted-foreground py-2 px-4 z-20 select-none"
        >
          <p className="text-xs">
            <span className="font-bold">{words}</span> {words === 1 ? 'word' : 'words'}
          </p>
          <p className="text-xs">
            <span className="font-bold">{characters}</span>{' '}
            {characters === 1 ? 'character' : 'characters'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ArticleReadTime;