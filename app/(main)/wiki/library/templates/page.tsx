'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronRight, FolderClosed, FolderOpen, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

// Example folder structure - you can modify this based on your needs
const folderStructure = {
  'Portfolio Templates': {
    'Investment Portfolios': {
      files: [
        { name: 'Portfolio Overview.docx', href: '#' },
        { name: 'Investment Summary.pdf', href: '#' },
      ],
    },
    'Portfolio Results': {
      files: [
        { name: 'Results Template.xlsx', href: '#' },
        { name: 'Performance Report.pdf', href: '#' },
      ],
    },
  },
  'Marketing Templates': {
    'Email Templates': {
      files: [
        { name: 'Newsletter Template.html', href: '#' },
        { name: 'Campaign Update.html', href: '#' },
      ],
    },
    'Social Media': {
      files: [
        { name: 'Post Template.psd', href: '#' },
        { name: 'Story Template.ai', href: '#' },
      ],
    },
  },
};

const FolderTree = ({ structure, level = 0 }: { structure: any; level?: number }) => {
  const [openFolders, setOpenFolders] = React.useState<Record<string, boolean>>({});

  const toggleFolder = (folderName: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  return (
    <div className="space-y-1">
      {Object.entries(structure).map(([name, content]: [string, any]) => (
        <div key={name} className="flex flex-col">
          <Collapsible
            open={openFolders[name]}
            onOpenChange={() => {
              toggleFolder(name);
            }}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-2 rounded-none border-none px-4 hover:bg-muted/50',
                  level > 0 && 'pl-8',
                )}
              >
                <ChevronRight
                  className={cn(
                    'h-4 w-4 shrink-0 transition-transform',
                    openFolders[name] && 'rotate-90',
                  )}
                />
                {openFolders[name] ? (
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <FolderClosed className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">{name}</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {content.files && (
                <div className="pl-14 py-1">
                  {content.files.map((file: any) => (
                    <a
                      key={file.name}
                      href={file.href}
                      className="flex items-center gap-2 py-1 px-4 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-sm"
                    >
                      <FileText className="h-4 w-4" />
                      {file.name}
                    </a>
                  ))}
                </div>
              )}
              {!content.files && <FolderTree structure={content} level={level + 1} />}
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  );
};

const TemplatesPage = () => {
  return (
    <div className="container mx-auto p-6">
      <Card className="border-none">
        <div className="rounded-md border">
          <FolderTree structure={folderStructure} />
        </div>
        <div className="flex gap-2">
          <Button>A</Button>
          <Button>B</Button>
          <Button>C</Button>
          <Button>D</Button>
          <Button>E</Button>
        </div>

        {/* Add filtering system, add script to parse all files inside bucket and create categories, add script to do fuzzy search on files */}
        {/* Attempt to get sharepoint API to automatically sync files to bucket */}
      </Card>
    </div>
  );
};

export default TemplatesPage;
