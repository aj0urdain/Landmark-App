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
import {
  Building2,
  Users,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Newspaper,
  Calendar,
} from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import UserCard from '@/components/molecules/UserCard/UserCard';
import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';
import BranchBadge from '@/components/molecules/BranchBadge/BranchBadge';
import DepartmentBadge from '@/components/molecules/DepartmentBadge/DepartmentBadge';
import { Dot } from '@/components/atoms/Dot/Dot';

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

  const { data: branchDetails } = useQuery({
    queryKey: ['branchDetails', branch?.branch_name],
    queryFn: async () => {
      if (!branch?.branch_name) return null;

      const { data: branchData, error } = await supabase
        .from('branches')
        .select(
          `
          branch_name,
          level_number,
          suite_number,
          street_number,
          contact_number,
          email,
          states (
            state_name,
            short_name
          ),
          streets (
            street_name
          ),
          suburbs (
            suburb_name,
            postcode
          )
        `,
        )
        .eq('branch_name', branch.branch_name)
        .single();

      if (error) {
        console.error('Error fetching branch details:', error);
        return null;
      }

      return branchData;
    },
    enabled: !!branch?.branch_name,
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
          src="https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/user_uploads/e2570807-6d18-4f80-921c-f66fa4d8b76a/lmbg-e2570807-6d18-4f80-921c-f66fa4d8b76a.webp"
          alt={branch.branch_name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/70" />

        <div className="absolute bottom-6 left-6">
          <Badge className="mb-2">{branch.states?.state_name}</Badge>
          <h1 className="text-4xl font-bold text-white">
            <BranchBadge
              branchName={branch.branch_name}
              size="huge"
              list
              colored={false}
            />
          </h1>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-transparent flex items-center gap-2 w-fit justify-center">
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2 hover:text-foreground"
          >
            <Building2 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="staff"
            className="flex items-center gap-2 hover:text-foreground"
          >
            <Users className="h-4 w-4" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="facilities" className="flex items-center gap-2" disabled>
            <Building2 className="h-4 w-4" />
            Facilities
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2" disabled>
            <Newspaper className="h-4 w-4" />
            News
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2" disabled>
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
        </TabsList>
        <Separator className="my-8" />

        <TabsContent value="overview" className="mt-6 animate-slide-down-fade-in">
          <div className="grid grid-cols-2 gap-6">
            {/* Office Information Card */}
            <Card className="h-fit w-full">
              <CardHeader className="space-y-4">
                <CardTitle className="flex items-start gap-1.5 text-xs font-medium text-muted-foreground/80">
                  <Building2 className="h-3 w-3" />
                  Office Information
                </CardTitle>
                <div className="whitespace-pre-line leading-snug">
                  <div className="flex flex-col gap-4">
                    {/* Location */}
                    <div className="flex flex-col items-start justify-start gap-0.5">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                        <MapPin className="h-3.5 w-3.5" />
                        {formatAddress()}
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-2">
                      {branch.contact_number && (
                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                          <Phone className="h-3.5 w-3.5" />
                          {branch.contact_number}
                        </div>
                      )}
                      {branch.email && (
                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                          <Mail className="h-3.5 w-3.5" />
                          {branch.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <Separator className="mx-6 w-[calc(100%-48px)] bg-muted" />

              <CardHeader className="space-y-4">
                <CardTitle className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/80">
                  <Briefcase className="h-3 w-3" />
                  Working Hours
                </CardTitle>
                <div className="whitespace-pre-line leading-snug">
                  <div className="flex flex-col gap-2">
                    <p className="flex justify-between text-sm">
                      <span className="font-medium text-muted-foreground">Monday</span>
                      <span className="font-semibold text-foreground/80">
                        8:30am - 5:30pm
                      </span>
                    </p>
                    <p className="flex justify-between text-sm">
                      <span className="font-medium text-muted-foreground">Tuesday</span>
                      <span className="font-semibold text-foreground/80">
                        8:30am - 5:30pm
                      </span>
                    </p>
                    <p className="flex justify-between text-sm">
                      <span className="font-medium text-muted-foreground">Wednesday</span>
                      <span className="font-semibold text-foreground/80">
                        8:30am - 5:30pm
                      </span>
                    </p>
                    <p className="flex justify-between text-sm">
                      <span className="font-medium text-muted-foreground">Thursday</span>
                      <span className="font-semibold text-foreground/80">
                        8:30am - 5:30pm
                      </span>
                    </p>
                    <p className="flex justify-between text-sm">
                      <span className="font-medium text-muted-foreground">Friday</span>
                      <span className="font-semibold text-foreground/80">
                        8:30am - 5:30pm
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium text-muted">Saturday</span>
                      <span className="text-muted">Not Available</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium text-muted">Sunday</span>
                      <span className="text-muted">Not Available</span>
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Staff Information Card */}
            <Card className="h-fit w-full">
              <CardHeader className="space-y-4">
                <CardTitle className="flex items-start gap-1.5 text-xs font-medium text-muted-foreground/80">
                  <Users className="h-3 w-3" />
                  Staff Information
                </CardTitle>
                <div className="whitespace-pre-line leading-snug">
                  <div className="flex flex-col gap-4">
                    {/* Staff Count */}
                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                      <p className="text-2xl font-bold">{staff?.length || 0}</p>
                      <p className="text-muted-foreground">Staff Members</p>
                    </div>

                    {/* Department List */}
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-muted-foreground/80">Departments</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {Object.entries(staffByDepartment).map(([deptId, { name }]) => (
                          <DepartmentBadge
                            key={deptId}
                            department={name}
                            size="large"
                            list
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staff" className="mt-6">
          <div className="space-y-24">
            {Object.entries(staffByDepartment).map(([deptId, { name, staff }]) => {
              return (
                <div key={deptId} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">
                      <DepartmentBadge department={name} list size="large" />
                    </h2>

                    <Dot size="tiny" className="bg-muted-foreground" />

                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {staff?.length}
                    </p>
                  </div>

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
