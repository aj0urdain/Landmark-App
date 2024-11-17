import { departmentInfo as departmentInfoArray } from '@/utils/getDepartmentInfo';
import { createBrowserClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';

export function GenericDepartmentHeader() {
  const pathname = usePathname();
  const supabase = createBrowserClient();

  // Get the department slug (e.g., "senior-leadership")
  const departmentSlug = pathname
    .split('/')
    .filter((segment) => segment !== 'wiki' && segment !== 'departments')
    .join('');

  console.log(departmentSlug);

  // Find the department info by matching the link property
  const departmentInfo = departmentInfoArray.find((dept) => dept.link === departmentSlug);

  const { icon: Icon } = departmentInfo ?? {};

  const { data: departmentData, isLoading } = useQuery({
    enabled: !!departmentInfo,
    queryKey: ['department', departmentInfo?.name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('department_name', departmentInfo?.name ?? '')
        .single();

      if (error) {
        console.error(error);
        return null;
      }

      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!departmentData) return null;
  if (!departmentInfo) return null;

  return (
    <div className="relative flex min-h-48 items-end justify-start overflow-hidden rounded-b-3xl">
      <Image
        src={`/images/auctionImages/crown-casino-melbourne.jpg`}
        alt={`Auction`}
        width={1000}
        height={1000}
        className="absolute left-0 top-0 h-full w-full object-cover object-bottom opacity-40"
      />
      <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-b from-background via-background/90 to-background/50" />
      <div className="z-10 flex items-center p-6">
        <div>
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="flex items-center gap-2">
              {React.createElement(Icon, {
                className: `h-6 w-6 animate-slide-left-fade-in ${departmentInfo?.color}`,
              })}
              <h1 className="text-4xl font-black animate-slide-right-fade-in">
                {departmentData.department_name}
              </h1>
            </div>
            <div>
              <p className="text-muted-foreground">{departmentData.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
