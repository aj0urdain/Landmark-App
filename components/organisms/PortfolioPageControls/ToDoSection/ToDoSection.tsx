import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { SectionName } from "@/types/portfolioControlsTypes";
import { sectionIcons } from "@/constants/portfolioPageConstants";
import {
  photoDataOptions,
  headlineDataOptions,
  addressDataOptions,
  financeDataOptions,
  propertyCopyDataOptions,
  agentsDataOptions,
  saleTypeDataOptions,
} from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";

const ToDoSection: React.FC = () => {
  const { data: photoData } = useQuery(photoDataOptions);
  const { data: headlineData } = useQuery(headlineDataOptions);
  const { data: addressData } = useQuery(addressDataOptions);
  const { data: financeData } = useQuery(financeDataOptions);
  const { data: propertyCopyData } = useQuery(propertyCopyDataOptions);
  const { data: agentsData } = useQuery(agentsDataOptions);
  const { data: saleTypeData } = useQuery(saleTypeDataOptions);

  const incompleteItems = {
    Photos: [
      { isNecessary: true, isDone: photoData?.photoCount ?? 0 > 0 },
    ].filter((task) => task.isNecessary && !task.isDone).length,
    Logos: 0, // Assuming logos are not necessary for now
    Headline: [{ isNecessary: true, isDone: !!headlineData?.headline }].filter(
      (task) => task.isNecessary && !task.isDone,
    ).length,
    Address: [
      { isNecessary: true, isDone: !!addressData?.suburb },
      { isNecessary: true, isDone: !!addressData?.state },
      { isNecessary: true, isDone: !!addressData?.street },
    ].filter((task) => task.isNecessary && !task.isDone).length,
    Finance: [
      { isNecessary: true, isDone: !!financeData?.financeCopy },
      { isNecessary: true, isDone: !!financeData?.financeType },
      { isNecessary: true, isDone: !!financeData?.financeAmount },
    ].filter((task) => task.isNecessary && !task.isDone).length,
    "Property Copy": [
      { isNecessary: true, isDone: !!propertyCopyData?.propertyCopy },
    ].filter((task) => task.isNecessary && !task.isDone).length,
    Agents: [
      {
        isNecessary: true,
        isDone: agentsData?.agents && agentsData.agents.length > 0,
      },
    ].filter((task) => task.isNecessary && !task.isDone).length,
    "Sale Type": [
      { isNecessary: true, isDone: !!saleTypeData?.saleType },
      {
        isNecessary: saleTypeData?.saleType === "auction",
        isDone: !!saleTypeData?.auctionId,
      },
      {
        isNecessary: saleTypeData?.saleType === "expression",
        isDone: !!saleTypeData?.expressionOfInterest?.closingDate,
      },
    ].filter((task) => task.isNecessary && !task.isDone).length,
  };

  return (
    <div className="mb-2 flex items-center justify-between">
      <Label>To Do:</Label>
      <div className="flex space-x-2">
        {Object.entries(incompleteItems).map(([section, count]) => {
          if (count > 0) {
            const IconComponent = sectionIcons[section as SectionName];
            return (
              <div key={section} className="flex items-center" title={section}>
                <IconComponent className="mr-1 h-4 w-4" />
                <span className="text-xs">{count}</span>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ToDoSection;
