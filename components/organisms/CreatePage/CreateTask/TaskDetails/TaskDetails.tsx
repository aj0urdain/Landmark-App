import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskDetailsProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({
  formData,
  updateFormData,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.dueDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.dueDate ? (
                format(new Date(formData.dueDate), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={
                formData.dueDate ? new Date(formData.dueDate) : undefined
              }
              onSelect={(date) => updateFormData({ dueDate: date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select
          name="priority"
          value={formData.priority || ""}
          onValueChange={(value) => updateFormData({ priority: value })}
        >
          <SelectTrigger id="priority">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="optional">Optional</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="completion_type">
          How many users need to mark this as complete?
        </Label>
        <Select
          name="completion_type"
          value={formData.completion_type || ""}
          onValueChange={(value) => updateFormData({ completion_type: value })}
        >
          <SelectTrigger id="completion_type">
            <SelectValue placeholder="Select completion type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="multiple">Multiple</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
