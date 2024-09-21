import WelcomeCard from "@/components/molecules/DashboardCards/WelcomeCard/WelcomeCard";
import ReferenceCard from "@/components/molecules/DashboardCards/ReferenceCard/ReferenceCard";
import CompanyCarousel from "@/components/molecules/DashboardCards/CompanyCarousel/CompanyCarousel";

import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";

async function DashboardPage() {
  return (
    <div className="mx-4 flex max-w-6xl flex-col items-center justify-center gap-4 py-4 2xl:mx-auto">
      <DashboardCardRow>
        <div className="col-span-5 max-h-[275px] overflow-y-visible">
          <WelcomeCard />
        </div>
        <div className="col-span-7 flex max-h-[275px] items-center justify-center">
          <CompanyCarousel />
        </div>
      </DashboardCardRow>
      <DashboardCardRow>
        <div className="col-span-4 max-h-[275px]">
          <ReferenceCard />
        </div>
        <div className="col-span-3 max-h-[275px]">
          <ReferenceCard />
        </div>
        <div className="col-span-5 max-h-[275px]">
          <ReferenceCard />
        </div>
      </DashboardCardRow>
    </div>
  );
}

export default DashboardPage;
