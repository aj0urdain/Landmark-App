import { memo, useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetPortal,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { TableOfContents } from '../TableOfContents';

export const Sidebar = memo(
  ({
    editor,
    isOpen,
    onClose,
  }: {
    editor: Editor;
    isOpen?: boolean;
    onClose: () => void;
  }) => {
    const [title, setTitle] = useState('Table of Contents');
    const [description, setDescription] = useState('Navigate through the document');

    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetPortal>
          <SheetContent
            side="left"
            className="absolute top-0 left-0 h-full w-[300px] sm:w-[400px] border-r"
            style={{
              position: 'absolute',
              height: '100%',
              transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            <SheetHeader>
              <SheetTitle>
                <Input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  className="text-lg font-semibold"
                />
              </SheetTitle>
              <SheetDescription>
                <Input
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  className="text-sm text-muted-foreground"
                />
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 h-full overflow-auto">
              <TableOfContents onItemClick={onClose} editor={editor} />
            </div>
          </SheetContent>
        </SheetPortal>
      </Sheet>
    );
  },
);

Sidebar.displayName = 'TableOfContentSidepanel';
