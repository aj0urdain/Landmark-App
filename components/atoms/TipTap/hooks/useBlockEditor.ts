import { Content, useEditor } from '@tiptap/react';
import type { Editor } from '@tiptap/core';

import type { Doc as YDoc } from 'yjs';

import { ExtensionKit } from '@/components/atoms/TipTap/extensions/extension-kit';

declare global {
  interface Window {
    editor: Editor | null;
  }
}

export const useBlockEditor = ({
  ydoc,
  canEdit,
  initialContent,
}: {
  ydoc: YDoc;
  canEdit: boolean;
  initialContent: Content;
}) => {
  const editor = useEditor(
    {
      editable: canEdit,
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      autofocus: canEdit,
      onCreate: (ctx) => {
        if (ctx.editor.isEmpty) {
          ctx.editor.commands.setContent(initialContent);
          ctx.editor.commands.focus('start', { scrollIntoView: true });
        }
      },
      extensions: ExtensionKit({}),
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full',
        },
      },
    },
    [ydoc, canEdit],
  );

  window.editor = editor;

  return { editor };
};
