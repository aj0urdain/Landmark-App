'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { List, PackagePlus, Pyramid, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';

export default function UpdatesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const upcomingFeatures = [
    {
      id: 1,
      title: 'Portfolio Page Builder',
      description:
        'Advanced document generation system for creating and managing portfolio pages with customizable templates.',
      eta: 'Q1 2024',
    },
    {
      id: 2,
      title: 'Task Management System',
      description:
        'Comprehensive task tracking and management platform for teams and individuals.',
      eta: 'Q1 2024',
    },
    {
      id: 3,
      title: 'Complete User Profiles',
      description:
        'Enhanced user profiles with detailed information, achievements, and team connections.',
      eta: 'Q1 2024',
    },
    {
      id: 4,
      title: 'Mobile Accessibility',
      description:
        'Access Landmark on the go with a fully responsive version of the application.',
      eta: 'Q1 2024',
    },
    {
      id: 5,
      title: 'Learning Platform',
      description:
        'Interactive learning management system with courses, certifications, and training materials.',
      eta: 'Q2 2024',
    },
  ];

  const filteredFeatures = upcomingFeatures.filter(
    (feature) =>
      feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card className="h-full w-full p-6">
      <CardHeader className="mb-6 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Pyramid className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Landmark Updates</h1>
        </div>
        <p className="text-muted-foreground">
          Stay informed about our latest features and improvements
        </p>
      </CardHeader>

      <Tabs defaultValue="upcoming" className="space-y-4 p-4 flex flex-col">
        <TabsList className="bg-transparent flex items-start gap-2">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <PackagePlus className="w-4 h-4" />
            Upcoming Features
          </TabsTrigger>
          <TabsTrigger value="changelog" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Changelog
          </TabsTrigger>
        </TabsList>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search updates..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
        </div>

        <TabsContent
          value="upcoming"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-down-fade-in"
        >
          {filteredFeatures.map((feature) => (
            <StaggeredAnimation index={feature.id} baseDelay={0} key={feature.id}>
              <Card
                key={feature.id}
                className="group/card relative flex flex-col h-full items-start justify-start min-h-[250px] transition-all duration-300 select-none cursor-pointer"
              >
                <p className="h-full bg-transparent border-none p-6 text-muted-foreground font-bold">
                  {feature.eta}
                </p>
                <CardHeader className="w-full h-full">
                  <CardTitle className="text-2xl mb-2 flex items-center gap-2 text-foreground/75 group-hover/card:text-foreground transition-all duration-300">
                    <PackagePlus className="w-5 h-5 text-yellow-500 animate-pulse" />
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </StaggeredAnimation>
          ))}
        </TabsContent>

        <TabsContent value="changelog" className="animate-slide-down-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Recent Changes</CardTitle>
              <CardDescription>No changelog entries to show yet</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
              Changelog coming soon
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
