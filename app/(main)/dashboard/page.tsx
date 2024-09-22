import WelcomeCard from "@/components/molecules/DashboardCards/WelcomeCard/WelcomeCard";
// import ReferenceCard from "@/components/molecules/DashboardCards/ReferenceCard/ReferenceCard";
import CompanyCarousel from "@/components/molecules/DashboardCards/CompanyCarousel/CompanyCarousel";

import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";
import DashboardFilter from "@/components/molecules/DashboardFilter/DashboardFilter";
import AgentPropertiesCard from "@/components/molecules/DashboardCards/AgentPropertiesCard/AgentPropertiesCard";

export default function DashboardPage() {
  return (
    <div className="grid h-full w-full flex-col gap-4">
      <DashboardFilter />
      <DashboardCardRow topRow={true}>
        <div className="col-span-5">
          <WelcomeCard />
        </div>
        <div className="col-span-7 flex items-center justify-center">
          <CompanyCarousel />
        </div>
      </DashboardCardRow>
      <DashboardCardRow>
        <div className="col-span-12 h-full min-h-[275px]">
          <AgentPropertiesCard />
        </div>
      </DashboardCardRow>
      {/* <DashboardCardRow>
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
      </DashboardCardRow> */}
    </div>
  );
}
