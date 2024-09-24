import WelcomeCard from "@/components/molecules/DashboardCards/WelcomeCard/WelcomeCard";
import CompanyCarousel from "@/components/molecules/DashboardCards/CompanyCarousel/CompanyCarousel";

import { DashboardCardRow } from "@/components/molecules/DashboardCards/DashboardCardRow/DashboardCardRow";
import DashboardFilter from "@/components/molecules/DashboardFilter/DashboardFilter";
import AgentPropertiesCard from "@/components/molecules/DashboardCards/AgentPropertiesCard/AgentPropertiesCard";
import { Separator } from "@/components/ui/separator";
import ReferenceCard from "@/components/molecules/DashboardCards/ReferenceCard/ReferenceCard";
import { BarChartInteractive } from "@/components/molecules/DashboardCards/BarChartInteractive/BarChartInteractive";
import { Label } from "@/components/ui/label";
import { House } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="grid w-full grid-flow-dense flex-col gap-4">
      <DashboardFilter />
      <DashboardCardRow topRow={true}>
        <div className="col-span-5">
          <WelcomeCard />
        </div>
        <div className="col-span-7 flex items-center justify-center">
          <CompanyCarousel />
        </div>
      </DashboardCardRow>
      <Separator className="my-8" />
      <DashboardCardRow>
        <div className="col-span-3 h-full max-h-[400px]">
          <ReferenceCard />
        </div>
        <div className="col-span-9 h-full max-h-[400px]">
          <BarChartInteractive />
        </div>
      </DashboardCardRow>
      <DashboardCardRow>
        <div className="col-span-12 flex h-full min-h-[275px] flex-col gap-2">
          <Label className="mt-2 flex items-center gap-2 text-lg text-muted-foreground">
            <House className="h-4 w-4" />
            Latest Property Submissions
          </Label>
          <AgentPropertiesCard />
        </div>
      </DashboardCardRow>
    </div>
  );
}
