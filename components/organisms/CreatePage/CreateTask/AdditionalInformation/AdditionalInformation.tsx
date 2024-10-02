import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Mock data fetches
const taskTitles = [
  { value: "title1", label: "Task Title 1" },
  { value: "title2", label: "Task Title 2" },
  { value: "title3", label: "Task Title 3" },
];

const properties = [
  { id: "prop1", name: "Property 1" },
  { id: "prop2", name: "Property 2" },
];

interface AdditionalInformationProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export const AdditionalInformation: React.FC<AdditionalInformationProps> = ({
  formData,
  updateFormData,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          name="tags"
          value={formData.tags || ""}
          onChange={handleChange}
          placeholder="Enter tags separated by commas"
        />
      </div>
      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
          placeholder="Enter any additional notes"
        />
      </div>
      <div>
        <Label htmlFor="depends_on_task_id">
          Does this task require another task to be completed first before this
          can be marked as complete?
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Select dependent tasks
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search tasks..." className="h-9" />
              <CommandList>
                <CommandEmpty>No tasks found.</CommandEmpty>
                <CommandGroup>
                  {taskTitles.map((task) => (
                    <CommandItem
                      key={task.value}
                      value={task.value}
                      onSelect={(value) => {
                        const newDependentTasks = [
                          ...(formData.depends_on_task_id || []),
                        ];
                        const index = newDependentTasks.indexOf(value);
                        if (index > -1) {
                          newDependentTasks.splice(index, 1);
                        } else {
                          newDependentTasks.push(value);
                        }
                        updateFormData({
                          depends_on_task_id: newDependentTasks,
                        });
                      }}
                    >
                      {task.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="property_id">
          Does this task relate to a property?
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Select property
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput
                placeholder="Search properties..."
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No properties found.</CommandEmpty>
                <CommandGroup>
                  {properties.map((property) => (
                    <CommandItem
                      key={property.id}
                      value={property.id}
                      onSelect={(value) =>
                        updateFormData({ property_id: value })
                      }
                    >
                      {property.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="attachments">
          Does this task have any attachments for reference?
        </Label>
        <Input
          id="attachments"
          name="attachments"
          type="file"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            updateFormData({ attachments: files });
          }}
        />
      </div>
    </div>
  );
};
