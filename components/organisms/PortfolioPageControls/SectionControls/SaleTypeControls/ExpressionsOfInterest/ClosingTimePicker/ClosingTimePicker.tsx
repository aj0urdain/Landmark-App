import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  saleTypeDataOptions,
  updateSaleType,
} from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";

const ClosingTimePicker: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: saleTypeData } = useQuery(saleTypeDataOptions);

  const updateSaleTypeMutation = useMutation({
    mutationFn: updateSaleType,
    onSuccess: (newData) => {
      queryClient.setQueryData(["saleTypeData"], newData);
    },
  });

  const handleClosingTimeChange = (time: string) => {
    if (!saleTypeData) return;
    updateSaleTypeMutation.mutate({
      ...saleTypeData,
      expressionOfInterest: {
        ...saleTypeData.expressionOfInterest,
        closingTime: time,
      },
    });
  };

  const handleClosingAmPmChange = (amPm: "AM" | "PM") => {
    if (!saleTypeData) return;
    updateSaleTypeMutation.mutate({
      ...saleTypeData,
      expressionOfInterest: {
        ...saleTypeData.expressionOfInterest,
        closingAmPm: amPm,
      },
    });
  };

  return (
    <div>
      <Label htmlFor="closing-time" className="text-xs text-slate-500">
        Closing Time
      </Label>
      <div className="flex gap-2">
        <Select
          value={saleTypeData?.expressionOfInterest?.closingTime}
          onValueChange={handleClosingTimeChange}
        >
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
              <SelectItem key={hour} value={hour.toString().padStart(2, "0")}>
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={saleTypeData?.expressionOfInterest?.closingAmPm}
          onValueChange={handleClosingAmPmChange}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ClosingTimePicker;
