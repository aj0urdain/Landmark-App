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
    icon: <FileText className="h-6 w-6" />,
    items: [
      { title: 'Understanding Commercial Real Estate Trends', link: '#' },
      { title: 'Top 10 Factors in Property Valuation', link: '#' },
      { title: 'Navigating Zoning Laws and Regulations', link: '#' },
    ],
  },
  {
    category: 'Video Tutorials',
    icon: <Video className="h-6 w-6" />,
    items: [
      { title: 'Introduction to Commercial Property Management', link: '#' },
      { title: 'Mastering Lease Negotiations', link: '#' },
      { title: 'Digital Marketing for Real Estate Professionals', link: '#' },
    ],
  },
  {
    category: 'E-Books',
    icon: <Book className="h-6 w-6" />,
    items: [
      { title: 'The Complete Guide to Commercial Real Estate Investing', link: '#' },
      { title: 'Sustainable Building Practices in Modern Real Estate', link: '#' },
      { title: 'Financial Modeling for Real Estate Development', link: '#' },
    ],
  },
  {
    category: 'Webinars',
    icon: <Users className="h-6 w-6" />,
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
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            Learning Resources
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Expand your knowledge and skills in commercial real estate
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="resources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resources">Learning Materials</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4">
          {resources.map((resource) => (
            <Card key={resource.category}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  {resource.icon}
                  <CardTitle>{resource.category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
        </TabsContent>

        <TabsContent value="certifications">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-6 w-6" />
                <CardTitle>Professional Certifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {certifications.map((cert) => (
                  <li key={cert.name} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-semibold">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Provider: {cert.provider}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Estimated Duration: {cert.duration}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6" />
                <CardTitle>Upcoming Events</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {events.map((event) => (
                  <li
                    key={event.name}
                    className="border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <h3 className="font-semibold">{event.name}</h3>
                    <p className="text-sm text-muted-foreground">Date: {event.date}</p>
                    <p className="text-sm text-muted-foreground">
                      Location: {event.location}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
