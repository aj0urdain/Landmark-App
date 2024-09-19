import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClosingTimePickerProps {
  closingTime: string;
  closingAmPm: "AM" | "PM";
  onTimeChange: (time: string) => void;
  onAmPmChange: (amPm: "AM" | "PM") => void;
}

const ClosingTimePicker: React.FC<ClosingTimePickerProps> = ({
  closingTime,
  closingAmPm,
  onTimeChange,
  onAmPmChange,
}) => {
  return (
    <div>
      <Label htmlFor="closing-time" className="text-xs text-slate-500">
        Closing Time
      </Label>
      <div className="flex gap-2">
        <Select value={closingTime} onValueChange={onTimeChange}>
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
        <Select value={closingAmPm} onValueChange={onAmPmChange}>
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
