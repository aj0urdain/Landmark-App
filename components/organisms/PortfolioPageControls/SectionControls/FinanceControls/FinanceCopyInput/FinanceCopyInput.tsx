import React, { useRef, useEffect } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = React.useState<number | null>(
    null,
  );

  useEffect(() => {
    if (textareaRef.current && cursorPosition !== null) {
      textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [value, cursorPosition]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCursorPosition(e.target.selectionStart);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="finance-copy">Finance Copy</Label>
      <Textarea
        ref={textareaRef}
        id="finance-copy"
        value={value}
        onChange={handleChange}
        placeholder="Enter finance copy here... (Each line will be a separate block)"
        rows={8}
      />
    </div>
  );
};

export default FinanceCopyInput;
