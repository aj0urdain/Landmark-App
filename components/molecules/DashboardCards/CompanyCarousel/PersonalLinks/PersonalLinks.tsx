import React from 'react';
import { Card } from '@/components/ui/card';
import { Link2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';

// Define the link type
type QuickLink = {
  id: number;
  title: string;
  url: string;
  icon: string;
  access: string[];
};

// Organize links by categories
const QUICK_LINKS: Record<string, QuickLink[]> = {
  general: [
    { id: 1, title: 'Propertybase', url: '#', icon: '💼', access: ['ALL'] },
    { id: 2, title: 'BR Website', url: '#', icon: '🌐', access: ['ALL'] },
    { id: 3, title: 'Docusign', url: '#', icon: '✍️', access: ['ALL'] },
    { id: 4, title: 'Formstack', url: '#', icon: '📝', access: ['ALL'] },
    { id: 5, title: 'Central Station', url: '#', icon: '🚉', access: ['ALL'] },
    { id: 6, title: 'RP Data', url: '#', icon: '📊', access: ['ALL'] },
    { id: 7, title: 'LandChecker', url: '#', icon: '🗺️', access: ['ALL'] },
  ],
  social: [
    { id: 8, title: 'BR Facebook', url: '#', icon: '📱', access: ['ALL'] },
    { id: 9, title: 'LinkedIn', url: '#', icon: '💼', access: ['ALL'] },
    { id: 10, title: 'Instagram', url: '#', icon: '📸', access: ['ALL'] },
  ],
  sharepoint: [
    { id: 11, title: 'Brisbane', url: '#', icon: '📁', access: ['BRISBANE'] },
    { id: 12, title: 'Sydney', url: '#', icon: '📁', access: ['SYDNEY'] },
    { id: 13, title: 'Supamac', url: '#', icon: '📁', access: ['SUPAMAC'] },
    { id: 14, title: 'National', url: '#', icon: '📁', access: ['ALL'] },
    { id: 15, title: 'Management', url: '#', icon: '📁', access: ['MANAGEMENT'] },
  ],
  news: [
    { id: 16, title: 'AFR', url: '#', icon: '📰', access: ['ALL'] },
    { id: 17, title: 'Herald Sun', url: '#', icon: '📰', access: ['ALL'] },
    { id: 18, title: 'Sydney Morning Herald', url: '#', icon: '📰', access: ['ALL'] },
    { id: 19, title: 'The Age', url: '#', icon: '📰', access: ['ALL'] },
    { id: 20, title: 'The Australian', url: '#', icon: '📰', access: ['ALL'] },
  ],
  department: [
    { id: 21, title: 'MYOB', url: '#', icon: '📒', access: ['ACCOUNTS'] },
    { id: 22, title: 'Deft', url: '#', icon: '💰', access: ['ACCOUNTS'] },
    {
      id: 23,
      title: 'TM1',
      url: '#',
      icon: '📊',
      access: ['ACCOUNTS', 'AGENCY', 'ADMIN'],
    },
    {
      id: 24,
      title: 'Cirrus8',
      url: '#',
      icon: '☁️',
      access: ['ACCOUNTS', 'MANAGEMENT'],
    },
    { id: 25, title: 'PageProof', url: '#', icon: '🎨', access: ['DESIGN'] },
    { id: 26, title: 'AuctionsLive', url: '#', icon: '🔨', access: ['ADMIN'] },
    {
      id: 27,
      title: 'IT Support',
      url: 'mailto:syfo@example.com',
      icon: '🔧',
      access: ['ALL'],
    },
  ],
  advertising: [
    { id: 28, title: 'RCA', url: '#', icon: '📢', access: ['ALL'] },
    { id: 29, title: 'CRE', url: '#', icon: '📢', access: ['ALL'] },
    { id: 30, title: 'CReady', url: '#', icon: '📢', access: ['ALL'] },
    { id: 31, title: 'DevReady', url: '#', icon: '📢', access: ['ALL'] },
    { id: 32, title: 'Real Estate', url: '#', icon: '📢', access: ['ALL'] },
  ],
};

const LinkTile = ({ title, url, icon }: { title: string; url: string; icon: string }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-start gap-1 rounded-lg text-muted-foreground truncate whitespace-nowrap hover:text-foreground border px-2 border-border hover:bg-accent transition-colors"
  >
    <span className="">{icon}</span>
    <span className="text-xs">{title}</span>
  </a>
);

// TODO: Get user's departments from auth context
const userDepartments = ['ACCOUNTS']; // This should come from your auth system

const PersonalLinks = () => {
  // Filter links based on user's department access
  const filterLinksByAccess = (links: QuickLink[]) => {
    return links.filter(
      (link) =>
        link.access.includes('ALL') ||
        link.access.some((access) => userDepartments.includes(access)),
    );
  };

  return (
    <Card className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between pt-4 pl-4 ">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Link2 className="h-4 w-4" />
          <h2 className="text-sm font-bold">Quick Links</h2>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="rounded-none flex justify-start p-2 py-6 gap-1 text-xs bg-transparent border-b border-muted/50 w-full">
          <TabsTrigger value="general" className="text-xs">
            General
          </TabsTrigger>
          <TabsTrigger value="social" className="text-xs">
            Social
          </TabsTrigger>
          <TabsTrigger value="sharepoint" className="text-xs">
            SharePoint
          </TabsTrigger>
          <TabsTrigger value="news" className="text-xs">
            News
          </TabsTrigger>
          <TabsTrigger value="department" className="text-xs">
            Department
          </TabsTrigger>
          <TabsTrigger value="advertising" className="text-xs">
            Advertising
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          {Object.entries(QUICK_LINKS).map(([category, links]) => (
            <TabsContent
              key={category}
              value={category}
              className="p-4 animate-slide-down-fade-in"
            >
              <div className="grid grid-cols-3 gap-3">
                {filterLinksByAccess(links).map((link, index) => (
                  <StaggeredAnimation
                    key={link.id}
                    index={index}
                    baseDelay={0.1}
                    incrementDelay={0.05}
                  >
                    <LinkTile key={link.id} {...link} />
                  </StaggeredAnimation>
                ))}
              </div>
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>
    </Card>
  );
};

export default PersonalLinks;
