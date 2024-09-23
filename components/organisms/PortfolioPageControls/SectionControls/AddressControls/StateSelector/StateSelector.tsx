import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { getAllStates } from "@/lib/stateConfigs";
import {
  addressDataOptions,
  updateAddress,
} from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";

const StateSelector: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: addressData } = useQuery(addressDataOptions);

  const updateAddressMutation = useMutation({
    mutationFn: (newState: string) => {
      if (!addressData) throw new Error("Address data not available");
      return updateAddress({ ...addressData, state: newState });
    },
    onSuccess: (newAddressData) => {
      queryClient.setQueryData(addressDataOptions.queryKey, newAddressData);
    },
  });

  const stateOptions = getAllStates();

  const selectedStateOption = stateOptions.find(
    (state) => state.value === addressData?.state,
  );

  const handleStateSelect = (stateValue: string) => {
    updateAddressMutation.mutate(stateValue);
  };

  return (
    <div className="space-y-0.5">
      <Label htmlFor="state-selector" className="text-xs text-muted-foreground">
        State
      </Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            id="state-selector"
            variant="outline"
            role="combobox"
            aria-expanded={false}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedStateOption
                ? selectedStateOption.label
                : "Select state..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          {stateOptions.map((state) => (
            <DropdownMenuItem
              key={state.value}
              onClick={() => handleStateSelect(state.value)}
            >
              <Check
                className={`mr-2 h-4 w-4 flex-shrink-0 ${
                  addressData?.state === state.value
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
              <span className="truncate">{state.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default StateSelector;
