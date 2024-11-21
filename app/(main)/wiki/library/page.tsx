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
import { cn } from '@/lib/utils';

// Organize categories by section
const categorizedItems = {
  portfolio: [
    {
      title: 'Portfolios',
      icon: <BookOpen className="w-4 h-4 mr-2" />,
      description: 'Access all of our portfolios',
      href: '/wiki/library/portfolios',
      count: '172 portfolios',
      disabled: true,
    },
    {
      title: 'Portfolio Magazines',
      icon: <BookOpen className="w-4 h-4 mr-2" />,
      description: 'Access our collection of portfolio magazines and publications',
      href: '/wiki/library/portfolio-magazines',
      count: '172 magazines',
      disabled: true,
    },
    {
      title: 'Portfolio Results',
      icon: <BookOpen className="w-4 h-4 mr-2" />,
      description: 'Access our collection of portfolio results',
      href: '/wiki/library/portfolio-results',
      count: '172 results',
      disabled: true,
    },
  ],
  assets: [
    {
      title: 'Templates',
      icon: <BookTemplate className="w-4 h-4 mr-2" />,
      description: 'Document templates for various business needs',
      href: '/wiki/library/templates',
      count: '24 templates',
      disabled: true,
    },
    {
      title: 'Images',
      icon: <ImageIcon className="w-4 h-4 mr-2" />,
      description: 'Property images, logos, and marketing assets',
      href: '/wiki/library/images',
      count: '1.2k images',
      disabled: true,
    },
    {
      title: 'Handbooks',
      icon: <FileText className="w-4 h-4 mr-2" />,
      description: 'Company manuals, guides, and documentation',
      href: '/wiki/library/handbooks',
      count: '12 handbooks',
      disabled: true,
    },
  ],
  insights: [
    {
      title: 'Reports',
      icon: <BookOpen className="w-4 h-4 mr-2" />,
      description: 'Access all of our industry reports',
      href: '/wiki/library/reports',
      count: '172 reports',
      disabled: true,
    },
    {
      title: 'Snapshots',
      icon: <FileSpreadsheet className="w-4 h-4 mr-2" />,
      description: 'Market snapshots and industry reports',
      href: '/wiki/library/snapshots',
      count: '45 reports',
      disabled: true,
    },
  ],
  other: [
    {
      title: 'Archive',
      icon: <Folder className="w-4 h-4 mr-2" />,
      description: 'Historical documents and archived materials',
      href: '/wiki/library/archive',
      count: '200+ files',
      disabled: true,
    },
  ],
};

export default function LibraryPage() {
  return (
    <div className="container mx-auto p-6 space-y-16">
      {Object.entries(categorizedItems).map(([category, items]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold capitalize">{category}</h2>
            <Separator className="flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <Link href={item.disabled ? '/updates' : item.href} key={item.title}>
                <Card
                  className={cn(
                    'transition-all p-6 flex flex-col justify-between h-52 cursor-pointer group',
                    'hover:shadow-lg hover:-translate-y-1',
                    'border-muted hover:border-primary',
                    item.disabled && 'cursor-not-allowed opacity-50',
                  )}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="opacity-50 group-hover:opacity-100 transition-opacity"
                      >
                        {item.count}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-0">
                      <div className="text-foreground transition-colors group-hover:text-primary">
                        {item.icon}
                      </div>
                      <h1 className="text-2xl font-bold text-muted-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h1>
                    </div>
                    <p className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors line-clamp-2 text-sm">
                      {item.description}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
