import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface FinanceTypeSelectProps {
  value: string;
  customValue: string;
  onChange: (value: string) => void;
  onCustomChange: (value: string) => void;
}

const FinanceTypeSelect: React.FC<FinanceTypeSelectProps> = ({
  value,
  customValue,
  onChange,
  onCustomChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="finance-type">Finance Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="finance-type">
          <SelectValue placeholder="Select finance type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rent">Rent</SelectItem>
          <SelectItem value="net_income">Net Income</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
      {value === "custom" && (
        <Input
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="Enter custom finance type"
        />
      )}
    </div>
  );
};

export default FinanceTypeSelect;
