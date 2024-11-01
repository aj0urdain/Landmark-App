import {
  CpuIcon,
  Award,
  Building,
  Megaphone,
  HandCoins,
  BadgeDollarSign,
  Cog,
  UserSearch,
  PenTool,
  Database,
  Component,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { createBrowserClient } from './supabase/client';

export interface DepartmentInfo {
  name: string;
  icon: LucideIcon;
  color: string;
  link: string;
}

export const departmentInfo: DepartmentInfo[] = [
  {
    name: 'All',
    icon: Component,
    color: 'text-gray-500 border-gray-500',
    link: 'all',
  },
  {
    name: 'Burgess Rawson',
    icon: Building,
    color: 'text-emerald-500 border-emerald-500',
    link: 'burgess-rawson',
  },
  {
    name: 'Technology',
    icon: CpuIcon,
    color: 'text-blue-500 border-blue-500',
    link: 'technology',
  },
  {
    name: 'Senior Leadership',
    icon: Award,
    color: 'text-purple-500 border-purple-500',
    link: 'senior-leadership',
  },
  {
    name: 'Agency',
    icon: Building,
    color: 'text-green-500 border-green-500',
    link: 'agency',
  },
  {
    name: 'Marketing',
    icon: Megaphone,
    color: 'text-yellow-500 border-yellow-500',
    link: 'marketing',
  },
  {
    name: 'Asset Management',
    icon: HandCoins,
    color: 'text-indigo-500 border-indigo-500',
    link: 'asset-management',
  },
  {
    name: 'Finance',
    icon: BadgeDollarSign,
    color: 'text-red-500 border-red-500',
    link: 'finance',
  },
  {
    name: 'Operations',
    icon: Cog,
    color: 'text-orange-500 border-orange-500',
    link: 'operations',
  },
  {
    name: 'Human Resources',
    icon: UserSearch,
    color: 'text-pink-500 border-pink-500',
    link: 'human-resources',
  },
  {
    name: 'Design',
    icon: PenTool,
    color: 'text-teal-500 border-teal-500',
    link: 'design',
  },
  {
    name: 'Data',
    icon: Database,
    color: 'text-cyan-500 border-cyan-500',
    link: 'data',
  },
];

export function getDepartmentInfo(
  department: string | number | null | undefined,
): DepartmentInfo | undefined {
  if (!department) return undefined;

  const departmentStr = department.toString();
  return departmentInfo.find(
    (info) => info.name.toLowerCase() === departmentStr.toLowerCase(),
  );
}

export async function getDepartmentName(department: number): Promise<string | undefined> {
  const supabase = createBrowserClient();

  console.log('department');
  console.log(department);

  const { data, error } = await supabase
    .from('departments')
    .select('department_name')
    .eq('id', department)
    .single();

  if (error) {
    console.error('Error fetching department name:', error);
    return undefined;
  }

  return data.department_name;
}
