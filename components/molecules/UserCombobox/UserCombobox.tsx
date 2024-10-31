import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

interface UserComboboxProps {
  selectedUserId: string | null;
  onChange: (userId: string) => void;
  placeholder: string;
  excludeUserIds?: string[];
  className?: string;
  modal?: boolean;
}

export function UserCombobox({
  selectedUserId,
  onChange,
  placeholder,
  excludeUserIds = [],
  className,
  modal = false,
}: UserComboboxProps) {
  const supabase = createBrowserClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['usersList'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profile_complete')
        .select('*')
        .order('first_name');

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      // Don't filter here - return all users
      return data;
    },
  });

  const options: ComboboxOption[] = users.map((user) => ({
    value: user.id ?? '',
    label: (
      <p className="flex items-center gap-1 font-light">
        {user.first_name ?? ''} <span className="font-bold">{user.last_name ?? ''}</span>
      </p>
    ),
    imageUrl: user.profile_picture ?? '',
    // Only disable if it's in excludeUserIds AND it's not the currently selected user
    disabled: excludeUserIds.includes(user.id ?? '') && user.id !== selectedUserId,
  }));

  if (isLoading) {
    return null;
  }

  return (
    <Combobox
      options={options}
      selectedValue={selectedUserId ?? undefined}
      onSelect={(value) => {
        // If selecting the same value, clear it
        if (value === selectedUserId) {
          onChange('');
        } else {
          onChange(value);
        }
      }}
      placeholder={placeholder}
      className={className}
      avatar
      modal={modal}
    />
  );
}
