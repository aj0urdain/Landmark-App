import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FinanceAmountInputProps {
  value: string;
  onChange: (value: string) => void;
}

const FinanceAmountInput: React.FC<FinanceAmountInputProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    onChange(numericValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="finance-amount">Finance Amount</Label>
      <Input
        id="finance-amount"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Enter finance amount"
      />
    </div>
  );
};

export default FinanceAmountInput;
