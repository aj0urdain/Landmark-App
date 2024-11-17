'use client';

import { CardContent, CardTitle } from '@/components/ui/card';
import {
  Settings,
  User,
  Bell,
  Lock,
  Palette,
  Database,
  CalendarHeart,
  Building2,
  Phone,
  IdCard,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { format } from 'date-fns';
import DepartmentBadge from '@/components/molecules/DepartmentBadge/DepartmentBadge';
import BranchBadge from '@/components/molecules/BranchBadge/BranchBadge';
import { useQuery } from '@tanstack/react-query';
import { userProfileOptions } from '@/types/userProfileTypes';

export default function SettingsPage() {
  const { data: userProfile, isLoading } = useQuery(userProfileOptions);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full w-full p-6">
      <CardTitle className="flex items-center gap-2 text-2xl font-bold mb-6">
        <Settings className="h-4 w-4" />
        Settings
      </CardTitle>
      <CardContent className="p-0">
        <Tabs defaultValue="info" className="flex h-[calc(100vh-12rem)]">
          <TabsList className="flex h-full w-1/3 flex-col justify-start items-stretch bg-muted/50 rounded-lg p-2">
            <TabsTrigger
              value="info"
              className="flex items-center gap-2 justify-start px-4 py-3 data-[state=active]:bg-background"
            >
              <User className="h-4 w-4" />
              Information
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2 justify-start px-4 py-3 data-[state=active]:bg-background"
              disabled
            >
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2 justify-start px-4 py-3 data-[state=active]:bg-background"
              disabled
            >
              <Lock className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="flex items-center gap-2 justify-start px-4 py-3 data-[state=active]:bg-background"
              disabled
            >
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="flex items-center gap-2 justify-start px-4 py-3 data-[state=active]:bg-background"
              disabled
            >
              <Database className="h-4 w-4" />
              Data & Storage
            </TabsTrigger>
          </TabsList>

          <div className="w-2/3 pl-6">
            <TabsContent value="info" className="mt-0 h-full">
              <div className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <Input value={userProfile?.first_name ?? ''} disabled />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input value={userProfile?.last_name ?? ''} disabled />
                    </div>
                  </div>
                </div>

                {/* Important Dates */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CalendarHeart className="h-4 w-4" />
                    Important Dates
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Birthday</Label>
                      <Input
                        value={
                          userProfile?.birthday
                            ? format(new Date(userProfile.birthday), 'MMMM d')
                            : ''
                        }
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Work Anniversary</Label>
                      <Input
                        value={
                          userProfile?.work_anniversary
                            ? format(new Date(userProfile.work_anniversary), 'PP')
                            : ''
                        }
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Organization */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Organization
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Departments</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {userProfile?.departments?.map((department) => (
                          <DepartmentBadge
                            key={department}
                            department={department}
                            size="small"
                            list
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Branches</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {userProfile?.branches?.map((branch) => (
                          <BranchBadge
                            key={branch}
                            branchName={branch}
                            size="small"
                            list
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Email</Label>
                      <Input value={userProfile?.email ?? ''} disabled />
                    </div>
                    <div>
                      <Label>Business Number</Label>
                      <Input value={userProfile?.business_number ?? ''} disabled />
                    </div>
                    <div className="col-span-2">
                      <Label>Mobile Number</Label>
                      <Input value={userProfile?.mobile_number ?? ''} disabled />
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <IdCard className="h-4 w-4" />
                    Account Information
                  </h2>
                  <div>
                    <Label>Account Created</Label>
                    <Input
                      value={
                        userProfile?.created_at
                          ? format(new Date(userProfile.created_at), 'PPpp')
                          : ''
                      }
                      disabled
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <p className="text-sm text-muted-foreground">
                Notification settings coming soon.
              </p>
            </TabsContent>

            <TabsContent value="security">
              <p className="text-sm text-muted-foreground">
                Security settings coming soon.
              </p>
            </TabsContent>

            <TabsContent value="appearance">
              <p className="text-sm text-muted-foreground">
                Appearance settings coming soon.
              </p>
            </TabsContent>

            <TabsContent value="data">
              <p className="text-sm text-muted-foreground">
                Data & Storage settings coming soon.
              </p>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </div>
  );
}
