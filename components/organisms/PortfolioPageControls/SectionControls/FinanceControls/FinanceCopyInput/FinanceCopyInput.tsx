import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FinanceCopyInputProps {
  value: string;
  onChange: (value: string) => void;
}

const FinanceCopyInput: React.FC<FinanceCopyInputProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="finance-copy">Finance Copy</Label>
      <Textarea
        id="finance-copy"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter finance copy here..."
      />
    </div>
  );
};

export default FinanceCopyInput;
