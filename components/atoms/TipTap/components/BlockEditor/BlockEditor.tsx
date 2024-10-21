import { Content, EditorContent } from '@tiptap/react';
import React, { useRef, useState } from 'react';
import { ReactElement } from 'react';

import { LinkMenu } from '@/components/atoms/TipTap/components/menus';

import { useBlockEditor } from '@/components/atoms/TipTap/hooks/useBlockEditor';

import '@/components/atoms/TipTap/styles/index.css';

import ImageBlockMenu from '@/components/atoms/TipTap/extensions/ImageBlock/components/ImageBlockMenu';
import { ColumnsMenu } from '@/components/atoms/TipTap/extensions/MultiColumn/menus';
import {
  TableColumnMenu,
  TableRowMenu,
} from '@/components/atoms/TipTap/extensions/Table/menus';
import { EditorHeader } from './components/EditorHeader';
import { TextMenu } from '../menus/TextMenu';
import { ContentItemMenu } from '../menus/ContentItemMenu';
import { useSidebar } from '@/components/atoms/TipTap/hooks/useSidebar';
import * as Y from 'yjs';
import { Separator } from '@/components/ui/separator';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import DepartmentBadge from '@/components/molecules/DepartmentBadge/DepartmentBadge';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dot } from '@/components/atoms/Dot/Dot';
import { format } from 'date-fns';

export const BlockEditor = ({
  ydoc,
  canEdit = false,
  saveArticle,
  initialContent,
}: {
  ydoc: Y.Doc;
  canEdit?: boolean;
  saveArticle: (content: any) => Promise<void>;
  initialContent: any;
}): ReactElement => {
  const menuContainerRef = useRef(null);

  const leftSidebar = useSidebar();
  const { editor } = useBlockEditor({
    ydoc,
    canEdit,
    initialContent: initialContent as Content,
  });

  const [reactions, setReactions] = useState({
    heart: 12,
    laugh: 12,
    celebrate: 12,
    sad: 12,
  });

  const handleReaction = (type: 'heart' | 'laugh' | 'celebrate' | 'sad') => {
    setReactions((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  return (
    <div className="flex h-full w-full" ref={menuContainerRef}>
      <div className={`relative flex flex-col flex-1 h-full ${canEdit ? '' : ''}`}>
        {canEdit && (
          <div className="sticky top-20 -mt-4 z-10 backdrop-blur-2xl h-fit flex w-full p-0 mx-0">
            <EditorHeader
              editor={editor}
              isSidebarOpen={leftSidebar.isOpen}
              toggleSidebar={leftSidebar.toggle}
              saveArticle={saveArticle}
            />
          </div>
        )}
        <div
          className={`flex-1 h-full gap-12 ${canEdit ? 'ml-24 mr-24 my-12' : 'ml-0 mr-0 my-6'}`}
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-row gap-4 items-center justify-between w-full">
              <h2 className="text-muted-foreground font-medium">
                {format(new Date(), 'EEEE, d MMMM yyyy')}
              </h2>

              <div className="flex flex-row gap-4 items-center">
                <p className="text-muted-foreground">5 minute read</p>
                <Dot size="small" className="bg-muted-foreground animate-pulse" />
                <p className="text-muted-foreground">2474 words</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 mb-2">
                <DepartmentBadge department="Burgess Rawson" list />
                <DepartmentBadge department="Marketing" list />
                <DepartmentBadge department="Technology" list />
                <DepartmentBadge department="Senior Leadership" list />
              </div>
              <h1 className="text-5xl font-bold h-fit">
                Burgess Rawson announces the release of Landmark, a new company intranet
                in 2025
              </h1>
              <p className="text-lg text-muted-foreground italic">
                Landmark is a new company intranet that will be utilised across the entire
                Burgess Rawson national team.
              </p>
            </div>
            <div className="flex flex-row gap-4 w-full">
              <Card className="relative min-h-[150px] min-w-96 flex flex-row items-center gap-2 justify-between p-4">
                <p className="font-bold uppercase text-sm tracking-wider">Aaron Girton</p>
                <Image
                  src="https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/staff_images/aarongirton.png?t=2024-10-04T21%3A03%3A26.445Z"
                  alt="Aaron Girton"
                  className="absolute right-0 top-0 h-full w-auto"
                  width={100}
                  height={100}
                />
              </Card>
              <div className="flex flex-col gap-4">
                <Card className="relative flex flex-row items-center gap-2 justify-between border-none p-4 h-full">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleReaction('heart');
                    }}
                    className="flex items-center gap-2 text-2xl font-bold py-6"
                  >
                    <span>❤️</span>
                    <p className="text-muted-foreground">{reactions.heart}</p>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleReaction('laugh');
                    }}
                    className="flex items-center gap-2 text-2xl font-bold py-6"
                  >
                    <span>😂</span>
                    <p className="text-muted-foreground">{reactions.laugh}</p>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleReaction('celebrate');
                    }}
                    className="flex items-center gap-2 text-2xl font-bold py-6"
                  >
                    <span>🥳</span>
                    <p className="text-muted-foreground">{reactions.celebrate}</p>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleReaction('sad');
                    }}
                    className="flex items-center gap-2 text-2xl font-bold py-6"
                  >
                    <span>😢</span>
                    <p className="text-muted-foreground">{reactions.sad}</p>
                  </Button>
                </Card>

                <Card className="relative flex flex-row items-center gap-2 justify-between p-4 h-full">
                  <MessageCircle className="h-4 w-4" />
                  <p>comments</p>
                </Card>
              </div>
            </div>
          </div>
          <Separator className="my-12" />
          <EditorContent editor={editor} />
          <Separator className="my-12" />
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Comments</h1>
            <Card className="relative min-h-[150px] min-w-96 flex flex-row items-center gap-2 justify-between p-4">
              comment section
            </Card>
          </div>
        </div>
        {canEdit && (
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
