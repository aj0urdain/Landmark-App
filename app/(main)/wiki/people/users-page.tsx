'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search } from 'lucide-react';
import debounce from 'lodash/debounce';
import Fuse from 'fuse.js';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { cn } from '@/lib/utils';

import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';
import UserCard from '@/components/molecules/UserCard/UserCard';
import { createBrowserClient } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { UserFilter } from '@/components/molecules/UserFilter/UserFilter';
import { Label } from '@/components/ui/label';

export function UsersPage() {
  const supabase = createBrowserClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const scrollDirection = useScrollDirection();

  // Debounced search handler with 1 second delay
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, 1000),
    [],
  );

  // Immediate search handler
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setIsSearching(true);
    debouncedSearch(value);
  };

  const {
    data: users,
    isLoading: isLoadingUsers,
    isError,
  } = useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from('user_profile_complete')
        .select('*')
        .order('work_anniversary', { ascending: true });

      if (error) {
        console.error(error);
      }

      return users;
    },
  });

  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    if (!users) return null;
    return new Fuse(users, {
      keys: ['first_name', 'last_name', 'email', 'departments', 'branches', 'roles'],
      threshold: 0.3,
      includeMatches: true,
    });
  }, [users]);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!debouncedQuery) return users;
    if (!fuse) return users;

    return fuse.search(debouncedQuery).map((result) => ({
      ...result.item,
      matches: result.matches,
    }));
  }, [users, debouncedQuery, fuse]);

  const filteredByFilters = useMemo(() => {
    return filteredUsers.filter((user) => {
      const matchesDepartment =
        selectedDepartments.length === 0 ||
        selectedDepartments.every((dept) => user.departments?.includes(dept));

      const matchesBranch =
        selectedBranches === '' || user.branches?.includes(selectedBranches);

      return matchesDepartment && matchesBranch;
    });
  }, [filteredUsers, selectedDepartments, selectedBranches]);

  // Get unique departments and branches
  const allDepartments = useMemo(() => {
    if (!users) return [];
    const departments = new Set(users.flatMap((user) => user.departments ?? []));
    return Array.from(departments);
  }, [users]);

  const allBranches = useMemo(() => {
    if (!users) return [];
    const branches = new Set(users.flatMap((user) => user.branches ?? []));
    return Array.from(branches);
  }, [users]);

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive">Error loading user profiles</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-8">
      <div
        className={cn(
          'sticky top-[80px] z-30 transition-transform duration-300',
          scrollDirection === 'down' ? '-translate-y-[200px]' : 'translate-y-0',
        )}
      >
        <Card className="p-6">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, department, branch, or role..."
                    value={searchQuery}
                    onChange={(e) => {
                      handleSearch(e.target.value);
                    }}
                    className="pl-8"
                  />
                  {isSearching && (
                    <div className="absolute right-2 top-2.5">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 w-full">
                <Label className="text-sm text-muted-foreground">Filter</Label>
                <div className="flex gap-4 w-full">
                  <UserFilter
                    type="departments"
                    options={allDepartments}
                    selectedOptions={selectedDepartments}
                    onFilterChange={setSelectedDepartments}
                  />
                  <UserFilter
                    type="branches"
                    options={allBranches}
                    selectedOptions={selectedBranches}
                    onFilterChange={setSelectedBranches}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {isLoadingUsers || isSearching ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <UserCard userId={''} skeletonLoader={true} key={index} />
          ))}
        </div>
      ) : filteredByFilters.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-2">
          <p className="text-muted-foreground">No users found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {filteredByFilters.map((user, index) => (
            <StaggeredAnimation key={String(user.id)} index={index}>
              <UserCard userId={user.id ?? ''} />
            </StaggeredAnimation>
          ))}
        </div>
      )}
    </div>
  );
}
