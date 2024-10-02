import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
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

const users = [
  { id: "user1", name: "John Doe" },
  { id: "user2", name: "Jane Smith" },
  { id: "user3", name: "Bob Johnson" },
];

const departments = [
  { id: "dept1", name: "Melbourne Agency" },
  { id: "dept2", name: "Sydney Agency" },
];

const branches = [
  { id: "branch1", name: "Melbourne Branch" },
  { id: "branch2", name: "Sydney Branch" },
];

interface BasicInformationProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export const BasicInformation: React.FC<BasicInformationProps> = ({
  formData,
  updateFormData,
}) => {
  const [openTitleCombobox, setOpenTitleCombobox] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleMultiSelect = (field: string, value: string) => {
    const currentValues = formData[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    updateFormData({ [field]: newValues });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="taskName">Task Name</Label>
        <Popover open={openTitleCombobox} onOpenChange={setOpenTitleCombobox}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openTitleCombobox}
              className="w-full justify-between"
            >
              {formData.taskName
                ? taskTitles.find((title) => title.value === formData.taskName)
                    ?.label
                : "Select task title..."}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput
                placeholder="Search task title..."
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No task title found.</CommandEmpty>
                <CommandGroup>
                  {taskTitles.map((title) => (
                    <CommandItem
                      key={title.value}
                      value={title.value}
                      onSelect={(currentValue) => {
                        updateFormData({ taskName: currentValue });
                        setOpenTitleCombobox(false);
                      }}
                    >
                      {title.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          formData.taskName === title.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Enter task description"
        />
      </div>
      <div>
        <Label htmlFor="assignee_ids">Assign Task to individual users</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Select assignees
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search users..." className="h-9" />
              <CommandList>
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup>
                  {users.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                      onSelect={() =>
                        handleMultiSelect("assignee_ids", user.id)
                      }
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          (formData.assignee_ids || []).includes(user.id)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {user.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="department_ids">
          Assign Task to specific departments
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Select departments
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput
                placeholder="Search departments..."
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No departments found.</CommandEmpty>
                <CommandGroup>
                  {departments.map((dept) => (
                    <CommandItem
                      key={dept.id}
                      value={dept.id}
                      onSelect={() =>
                        handleMultiSelect("department_ids", dept.id)
                      }
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          (formData.department_ids || []).includes(dept.id)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {dept.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="branch_ids">Assign Task to specific branches</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Select branches
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search branches..." className="h-9" />
              <CommandList>
                <CommandEmpty>No branches found.</CommandEmpty>
                <CommandGroup>
                  {branches.map((branch) => (
                    <CommandItem
                      key={branch.id}
                      value={branch.id}
                      onSelect={() =>
                        handleMultiSelect("branch_ids", branch.id)
                      }
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          (formData.branch_ids || []).includes(branch.id)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {branch.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="creator_ids">Who owns this task?</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Select creators
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search users..." className="h-9" />
              <CommandList>
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup>
                  {users.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                      onSelect={() => handleMultiSelect("creator_ids", user.id)}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          (formData.creator_ids || []).includes(user.id)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {user.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
