import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, Check } from "lucide-react";
import { Label } from "@/components/ui/label";

interface StateSelectorProps {
  selectedState: string;
  onStateSelect: (state: string) => void;
}

const stateOptions = [
  { value: "nsw", label: "New South Wales" },
  { value: "vic", label: "Victoria" },
  { value: "qld", label: "Queensland" },
  { value: "wa", label: "Western Australia" },
  { value: "sa", label: "South Australia" },
  { value: "tas", label: "Tasmania" },
  { value: "act", label: "Australian Capital Territory" },
  { value: "nt", label: "Northern Territory" },
];

const StateSelector: React.FC<StateSelectorProps> = ({
  selectedState,
  onStateSelect,
}) => {
  const selectedStateOption = stateOptions.find(
    (state) => state.value === selectedState,
  );

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
              onClick={() => onStateSelect(state.value)}
            >
              <Check
                className={`mr-2 h-4 w-4 flex-shrink-0 ${
                  selectedState === state.value ? "opacity-100" : "opacity-0"
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
