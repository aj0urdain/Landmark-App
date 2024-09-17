import WelcomeCard from '@/components/molecules/DashboardCards/WelcomeCard/WelcomeCard';
import ReferenceCard from '@/components/molecules/DashboardCards/ReferenceCard/ReferenceCard';
import CompanyCarousel from '@/components/molecules/DashboardCards/CompanyCarousel/CompanyCarousel';

import { getQueryClient } from '@/utils/get-query-client';
import {
  userProfileOptions,
  userRolesOptions,
  userDepartmentsOptions,
  userBranchesOptions,
} from '@/utils/user-profile';
import { DashboardCardRow } from '@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow';

async function DashboardPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(userProfileOptions),
    queryClient.prefetchQuery(userRolesOptions),
    queryClient.prefetchQuery(userDepartmentsOptions),
    queryClient.prefetchQuery(userBranchesOptions),
  ]);

  return (
    <div className='flex flex-col items-center justify-center gap-4 mx-4 2xl:mx-auto max-w-6xl py-4'>
      <DashboardCardRow>
        <div className='col-span-5 max-h-[275px] overflow-y-visible'>
          <WelcomeCard />
        </div>
        <div className='col-span-7 flex items-center justify-center max-h-[275px]'>
          <CompanyCarousel />
        </div>
      </DashboardCardRow>
      <DashboardCardRow>
        <div className='col-span-4 max-h-[275px]'>
          <ReferenceCard />
        </div>
        <div className='col-span-3 max-h-[275px]'>
          <ReferenceCard />
        </div>
        <div className='col-span-5 max-h-[275px]'>
          <ReferenceCard />
        </div>
      </DashboardCardRow>
    </div>
  );
}

export default DashboardPage;