import { memo } from 'react';

export interface EditorInfoProps {
  characters: number;
  words: number;
}

export const EditorInfo = memo(({ characters, words }: EditorInfoProps) => {
  return (
    <div className="flex justify-center text-right text-muted-foreground gap-2">
      <div className="text-xs font-semibold">
        {words} {words === 1 ? 'word' : 'words'}
      </div>
      <div className="text-xs font-semibold">
        {characters} {characters === 1 ? 'character' : 'characters'}
      </div>
    </div>
  );
});

EditorInfo.displayName = 'EditorInfo';
