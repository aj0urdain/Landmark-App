'use client';

import { useRef } from 'react';
import { Sidebar } from './components/Sidebar';

import { EditorContent } from '@tiptap/react';
import { ContentItemMenu, LinkMenu, TextMenu } from './components/menus';
import { ColumnsMenu } from './extensions/MultiColumn/menus';
import { TableColumnMenu, TableRowMenu } from './extensions/Table/menus';
import ImageBlockMenu from './extensions/ImageBlock/components/ImageBlockMenu';
import { useBlockEditor } from './hooks/useBlockEditor';
import { Doc as YDoc } from 'yjs';
import { useSidebar } from './hooks/useSidebar';

export const TipTap = () => {
  const menuContainerRef = useRef(null);

  const leftSidebar = useSidebar();

  const { editor } = useBlockEditor({ ydoc: new YDoc(), canEdit: false });

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <Sidebar isOpen={leftSidebar.isOpen} onClose={leftSidebar.close} editor={editor} />
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  );
};

export default TipTap;
