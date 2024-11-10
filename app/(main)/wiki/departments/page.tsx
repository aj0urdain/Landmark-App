'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Building2,
  Users,
  Megaphone,
  BarChart,
  Briefcase,
  Calculator,
  Cog,
  UserPlus,
  Paintbrush,
  Database,
} from 'lucide-react';

const departments = [
  {
    name: 'Technology',
    icon: <Cog className="h-6 w-6" />,
    description: 'Driving innovation and digital transformation',
  },
  {
    name: 'Senior Leadership',
    icon: <Users className="h-6 w-6" />,
    description: "Guiding our company's vision and strategy",
  },
  {
    name: 'Agency',
    icon: <Building2 className="h-6 w-6" />,
    description: 'Representing clients in property transactions',
  },
  {
    name: 'Marketing',
    icon: <Megaphone className="h-6 w-6" />,
    description: 'Promoting our properties and services',
  },
  {
    name: 'Asset Management',
    icon: <BarChart className="h-6 w-6" />,
    description: 'Optimizing property performance and value',
  },
  {
    name: 'Finance',
    icon: <Calculator className="h-6 w-6" />,
    description: 'Managing financial operations and investments',
  },
  {
    name: 'Operations',
    icon: <Briefcase className="h-6 w-6" />,
    description: 'Ensuring smooth day-to-day business functions',
  },
  {
    name: 'Human Resources',
    icon: <UserPlus className="h-6 w-6" />,
    description: 'Supporting and developing our workforce',
  },
  {
    name: 'Design',
    icon: <Paintbrush className="h-6 w-6" />,
    description: 'Creating appealing spaces and visual assets',
  },
  {
    name: 'Data',
    icon: <Database className="h-6 w-6" />,
    description: 'Leveraging data for informed decision-making',
  },
];

export default function DepartmentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            Our Departments
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Discover the diverse teams that drive our success in commercial real estate
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <Card
            key={department.name}
            className="transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">{department.icon}</div>
                <CardTitle>{department.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{department.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
