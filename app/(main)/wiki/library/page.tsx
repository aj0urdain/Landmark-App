import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Book,
  FileText,
  PieChart,
  Image,
  Video,
  Headphones,
  FileSpreadsheet,
  Database,
  Presentation,
  Palette,
  Type,
} from 'lucide-react';

export default function LibraryPage() {
  const categories = [
    {
      title: 'Premium Content',
      icon: <Book className="w-4 h-4 mr-2" />,
      items: [
        'Premium IM PDF',
        'Premium IM Submission',
        'Premium IM Working Folder',
        'Market Share Reports',
      ],
    },
    {
      title: 'Industry Resources',
      icon: <PieChart className="w-4 h-4 mr-2" />,
      items: [
        'Portfolio Magazine Library',
        'Industry Reports',
        'Industry Snapshots',
        'Auction Results',
      ],
    },
    {
      title: 'Company Resources',
      icon: <FileText className="w-4 h-4 mr-2" />,
      items: ['Capability Statement', 'IM/Submission Templates'],
    },
    {
      title: 'Design Assets',
      icon: <Palette className="w-4 h-4 mr-2" />,
      items: ['Icon Library', 'Color Palette', 'Typography Guide'],
    },
    {
      title: 'Multimedia',
      icon: <Image className="w-4 h-4 mr-2" />,
      items: ['Images', 'Videos', 'Audio'],
    },
    {
      title: 'Documents',
      icon: <FileSpreadsheet className="w-4 h-4 mr-2" />,
      items: ['Documents', 'Spreadsheets', 'Presentations'],
    },
    {
      title: 'Data',
      icon: <Database className="w-4 h-4 mr-2" />,
      items: ['Databases', 'Market Data', 'Property Listings'],
    },
  ];

  return (
    <div className="w-full h-full ">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Burgess Rawson Resource Library
          </CardTitle>
          <CardDescription>
            Access a comprehensive collection of resources for Burgess Rawson.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {categories.map((category, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <div className="flex items-center">
                    {category.icon}
                    <span>{category.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {category.items.map((item, itemIndex) => (
                      <Card key={itemIndex} className="flex flex-col justify-between">
                        <CardHeader>
                          <CardTitle className="text-lg">{item}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            Access and manage {item.toLowerCase()} for your commercial
                            real estate projects.
                          </p>
                          <div className="flex justify-between items-center">
                            <Badge variant="secondary">0 items</Badge>
                            <Button size="sm">View</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
