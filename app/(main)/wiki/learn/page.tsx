'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Video, FileText, Lightbulb, Users, Calendar } from 'lucide-react';

const resources = [
  {
    category: 'Articles',
    icon: <FileText className="h-5 w-5" />,
    items: [
      { title: 'Understanding Commercial Real Estate Trends', link: '#' },
      { title: 'Top 10 Factors in Property Valuation', link: '#' },
      { title: 'Navigating Zoning Laws and Regulations', link: '#' },
    ],
  },
  {
    category: 'Video Tutorials',
    icon: <Video className="h-5 w-5" />,
    items: [
      { title: 'Introduction to Commercial Property Management', link: '#' },
      { title: 'Mastering Lease Negotiations', link: '#' },
      { title: 'Digital Marketing for Real Estate Professionals', link: '#' },
    ],
  },
  {
    category: 'E-Books',
    icon: <Book className="h-5 w-5" />,
    items: [
      { title: 'The Complete Guide to Commercial Real Estate Investing', link: '#' },
      { title: 'Sustainable Building Practices in Modern Real Estate', link: '#' },
      { title: 'Financial Modeling for Real Estate Development', link: '#' },
    ],
  },
  {
    category: 'Webinars',
    icon: <Users className="h-5 w-5" />,
    items: [
      { title: 'Upcoming: Market Analysis Techniques for 2024', link: '#' },
      { title: 'Recorded: Effective Client Relationship Management', link: '#' },
      { title: 'Recorded: Tech Innovations in Property Management', link: '#' },
    ],
  },
];

const certifications = [
  {
    name: 'Certified Commercial Investment Member (CCIM)',
    provider: 'CCIM Institute',
    duration: '150-200 hours',
  },
  {
    name: 'Certified Property Manager (CPM)',
    provider: 'Institute of Real Estate Management',
    duration: 'Varies',
  },
  {
    name: 'LEED Green Associate',
    provider: 'U.S. Green Building Council',
    duration: '30-100 hours',
  },
];

const events = [
  {
    name: 'Annual Real Estate Summit',
    date: 'September 15-17, 2024',
    location: 'Sydney Convention Center',
  },
  {
    name: 'PropTech Innovation Workshop',
    date: 'November 5, 2024',
    location: 'Melbourne Tech Hub',
  },
  {
    name: 'Commercial Real Estate Networking Night',
    date: 'Monthly, Last Thursday',
    location: 'Various Locations',
  },
];

export default function LearnPage() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-8rem)] flex-col gap-8 px-4 py-8">
      <Card className="flex-1 animate-slide-up-fade-in [animation-delay:200ms]">
        <CardContent className="p-6">
          <Tabs defaultValue="resources" className="h-full">
            <TabsList className="w-fit flex items-center gap-2 bg-transparent">
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                Learning Materials
              </TabsTrigger>
              <TabsTrigger value="certifications" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Certifications
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resources" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {resources.map((resource, idx) => (
                  <Card
                    key={resource.category}
                    className="animate-slide-up-fade-in overflow-hidden"
                    style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                  >
                    <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                      {resource.icon}
                      <CardTitle className="text-xl">{resource.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {resource.items.map((item) => (
                          <li key={item.title}>
                            <a href={item.link} className="text-primary hover:underline">
                              {item.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="certifications" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    <CardTitle>Professional Certifications</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {certifications.map((cert) => (
                      <Card key={cert.name} className="overflow-hidden">
                        <CardHeader className="space-y-0 pb-2">
                          <CardTitle className="text-lg">{cert.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Provider: {cert.provider}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Duration: {cert.duration}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <CardTitle>Upcoming Events</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {events.map((event) => (
                      <Card key={event.name} className="overflow-hidden">
                        <CardHeader className="space-y-0 pb-2">
                          <CardTitle className="text-lg">{event.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Date: {event.date}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Location: {event.location}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
