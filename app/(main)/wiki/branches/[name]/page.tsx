'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import UserCard from '@/components/molecules/UserCard/UserCard';
import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';
import BranchBadge from '@/components/molecules/BranchBadge/BranchBadge';
import DepartmentBadge from '@/components/molecules/DepartmentBadge/DepartmentBadge';

interface BranchDetails {
  branch_name: string;
  level_number: string | null;
  suite_number: string | null;
  street_number: string;
  phone: string;
  email: string;
  states: {
    state_name: string;
    short_name: string;
  };
  streets: {
    street_name: string;
  };
  suburbs: {
    suburb_name: string;
    postcode: string;
  };
}

const BranchPage = ({ params }: { params: { name: string } }) => {
  const supabase = createBrowserClient();

  const { data: branch, isLoading } = useQuery({
    queryKey: ['branch', params.name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branches')
        .select(
          `
          *,
          states (state_name, short_name),
          streets (street_name),
          suburbs (suburb_name, postcode)
        `,
        )
        .ilike('branch_name', params.name.replace(/-/g, ' '))
        .single();

      if (error) {
        console.error(error);
        return null;
      }

      console.log(data);

      return data;
    },
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('id')
        .neq('department_name', 'Burgess Rawson');

      if (error) throw error;
      return data;
    },
  });

  const { data: staff } = useQuery({
    queryKey: ['branchStaff', branch?.branch_name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profile_complete')
        .select('id, department_ids, departments')
        .contains('branches', [branch?.branch_name ?? ''])
        .order('work_anniversary', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!branch,
  });

  if (isLoading) {
    return <div>Loading branch details...</div>;
  }

  if (!branch) {
    return <div>Branch not found</div>;
  }

  const formatAddress = () => {
    return [
      branch.level_number && `Level ${branch.level_number}`,
      branch.suite_number && `Suite ${branch.suite_number}`,
      branch.street_number,
      branch.streets?.street_name,
      branch.suburbs?.suburb_name,
      branch.states?.short_name,
      branch.suburbs?.postcode,
    ]
      .filter(Boolean)
      .join(', ');
  };

  const staffByDepartment =
    departments?.reduce(
      (acc, department) => {
        const departmentStaff =
          staff?.filter((member) => member.department_ids?.includes(department.id)) ?? [];

        if (departmentStaff.length > 0) {
          acc[department.id] = {
            name: department.department_name,
            staff: departmentStaff,
          };
        }

        return acc;
      },
      {} as Record<number, { name: string; staff: typeof staff }>,
    ) ?? {};

  return (
    <div className="container mx-auto space-y-8 p-8">
      <div className="relative h-64 w-full overflow-hidden rounded-xl">
        <Image
          src="/images/office-placeholder.jpg"
          alt={branch.branch_name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />
        <div className="absolute bottom-6 left-6">
          <Badge className="mb-2">{branch.states?.state_name}</Badge>
          <h1 className="text-4xl font-bold text-white">{branch.branch_name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{formatAddress()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{branch.contact_number}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Staff Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{staff?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Tabs defaultValue="staff" className="w-full">
        <TabsList>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="facilities" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Facilities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="mt-6">
          <div className="space-y-24">
            {Object.entries(staffByDepartment).map(([deptId, { name, staff }]) => {
              return (
                <div key={deptId} className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    <DepartmentBadge department={name} list size="large" />
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {staff?.length} staff members
                  </p>

                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    {staff?.map((member, index) => (
                      <StaggeredAnimation key={member?.id ?? ''} index={index + 1}>
                        <UserCard userId={member?.id ?? ''} />
                      </StaggeredAnimation>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="facilities" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Office Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Meeting Rooms</li>
                  <li>Kitchen Facilities</li>
                  <li>Parking Available</li>
                  <li>24/7 Access</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transportation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Nearby Public Transport</li>
                  <li>Secure Parking</li>
                  <li>Bicycle Storage</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BranchPage;
