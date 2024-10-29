import { Editor, EditorContent } from '@tiptap/react';
import React, { useRef } from 'react';
import { ReactElement } from 'react';

import { LinkMenu } from '@/components/atoms/TipTap/components/menus';

import '@/components/atoms/TipTap/styles/index.css';

import ImageBlockMenu from '@/components/atoms/TipTap/extensions/ImageBlock/components/ImageBlockMenu';
import { ColumnsMenu } from '@/components/atoms/TipTap/extensions/MultiColumn/menus';
import {
  TableColumnMenu,
  TableRowMenu,
} from '@/components/atoms/TipTap/extensions/Table/menus';

import { TextMenu } from '../menus/TextMenu';
import { ContentItemMenu } from '../menus/ContentItemMenu';

export const BlockEditor = ({
  editing = false,
  editor,
}: {
  editing: boolean;
  editor: Editor;
}): ReactElement => {
  const menuContainerRef = useRef(null);

  return (
    <div className="flex h-full w-full" ref={menuContainerRef}>
      <div className={`relative flex flex-col flex-1 h-full -mx-8`}>
        <EditorContent editor={editor} />

        {editing && (
          <>
            <ContentItemMenu editor={editor} />
            <LinkMenu editor={editor} appendTo={menuContainerRef} />
            <TextMenu editor={editor} />
            <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
            <TableRowMenu editor={editor} appendTo={menuContainerRef} />
            <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
            <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
          </>
        )}
      </div>
    </div>
  );
};

export default BlockEditor;
