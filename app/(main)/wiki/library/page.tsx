import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  BookOpen,
  Image as ImageIcon,
  FileSpreadsheet,
  Folder,
  BookTemplate,
} from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

// Organize categories by section
const categorizedItems = {
  portfolio: [
    {
      title: 'Portfolios',
      icon: <BookOpen className="w-4 h-4 mr-2" />,
      description: 'Access all of our portfolios',
      href: '/wiki/library/portfolios',
      count: '172 portfolios',
    },
    {
      title: 'Portfolio Magazines',
      icon: <BookOpen className="w-4 h-4 mr-2" />,
      description: 'Access our collection of portfolio magazines and publications',
      href: '/wiki/library/portfolio-magazines',
      count: '172 magazines',
    },
    {
      title: 'Portfolio Results',
      icon: <BookOpen className="w-4 h-4 mr-2" />,
      description: 'Access our collection of portfolio results',
      href: '/wiki/library/portfolio-results',
      count: '172 results',
    },
  ],
  assets: [
    {
      title: 'Templates',
      icon: <BookTemplate className="w-4 h-4 mr-2" />,
      description: 'Document templates for various business needs',
      href: '/wiki/library/templates',
      count: '24 templates',
    },
    {
      title: 'Images',
      icon: <ImageIcon className="w-4 h-4 mr-2" />,
      description: 'Property images, logos, and marketing assets',
      href: '/wiki/library/images',
      count: '1.2k images',
    },
    {
      title: 'Handbooks',
      icon: <FileText className="w-4 h-4 mr-2" />,
      description: 'Company manuals, guides, and documentation',
      href: '/wiki/library/handbooks',
      count: '12 handbooks',
    },
  ],
  insights: [
    {
      title: 'Reports',
      icon: <BookOpen className="w-4 h-4 mr-2" />,
      description: 'Access all of our industry reports',
      href: '/wiki/library/reports',
      count: '172 reports',
    },
    {
      title: 'Snapshots',
      icon: <FileSpreadsheet className="w-4 h-4 mr-2" />,
      description: 'Market snapshots and industry reports',
      href: '/wiki/library/snapshots',
      count: '45 reports',
    },
  ],
  other: [
    {
      title: 'Archive',
      icon: <Folder className="w-4 h-4 mr-2" />,
      description: 'Historical documents and archived materials',
      href: '/wiki/library/archive',
      count: '200+ files',
    },
  ],
};

export default function LibraryPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {Object.entries(categorizedItems).map(([category, items]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold capitalize">{category}</h2>
            <Separator className="flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <Link href={item.href} key={item.title}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {item.icon}
                      <span>{item.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">{item.count}</Badge>
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
