import { Content, useEditor } from '@tiptap/react';
import type { Editor } from '@tiptap/core';

import { ExtensionKit } from '@/components/atoms/TipTap/extensions/extension-kit';

declare global {
  interface Window {
    editor: Editor | null;
  }
}

export const useBlockEditor = ({
  editing,
  initialContent = { type: 'doc', content: [{ type: 'paragraph' }] },
  enabled = true,
}: {
  editing: boolean;
  initialContent?: Content;
  enabled: boolean;
}) => {
  const editor = useEditor(
    {
      editable: enabled && editing,
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      autofocus: editing,
      extensions: ExtensionKit({}),
      content: initialContent,
      onCreate: ({ editor }) => {
        if (editor.isEmpty && initialContent) {
          editor.commands.setContent(initialContent);
          if (editing) {
            editor.commands.focus('start', { scrollIntoView: true });
          }
        }
      },
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full',
        },
      },
    },
    [editing, initialContent],
  );

  window.editor = editor;

  return { editor };
};
