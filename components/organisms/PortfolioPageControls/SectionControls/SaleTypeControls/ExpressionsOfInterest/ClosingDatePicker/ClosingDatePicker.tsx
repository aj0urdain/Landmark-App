import React from "react";
import { format, addDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ClosingDatePickerProps {
  closingDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

const ClosingDatePicker: React.FC<ClosingDatePickerProps> = ({
  closingDate,
  onDateChange,
}) => {
  return (
    <div>
      <Label htmlFor="closing-date" className="text-xs text-slate-500">
        Closing Date
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="closing-date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !closingDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {closingDate ? (
              format(closingDate, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="flex w-auto flex-col space-y-2 p-2"
        >
          <Select
            onValueChange={(value) =>
              onDateChange(addDays(new Date(), parseInt(value)))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="0">Today</SelectItem>
              <SelectItem value="1">Tomorrow</SelectItem>
              <SelectItem value="3">In 3 days</SelectItem>
              <SelectItem value="7">In a week</SelectItem>
            </SelectContent>
          </Select>
          <div className="rounded-md border">
            <Calendar
              mode="single"
              selected={closingDate}
              onSelect={onDateChange}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ClosingDatePicker;
