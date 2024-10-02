import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data fetch
const users = [
  { id: "user1", name: "John Doe" },
  { id: "user2", name: "Jane Smith" },
  { id: "user3", name: "Bob Johnson" },
];

interface ApprovalSettingsProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export const ApprovalSettings: React.FC<ApprovalSettingsProps> = ({
  formData,
  updateFormData,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="requiresApproval"
          name="requiresApproval"
          checked={formData.requiresApproval || false}
          onCheckedChange={(checked) =>
            updateFormData({ requiresApproval: checked })
          }
        />
        <Label htmlFor="requiresApproval">Requires Approval</Label>
      </div>
      {formData.requiresApproval && (
        <>
          <div>
            <Label htmlFor="approval_assignees">
              Who should approve this task as complete?
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Select approvers
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
                          onSelect={(value) => {
                            const newApprovers = [
                              ...(formData.approval_assignees || []),
                            ];
                            const index = newApprovers.indexOf(value);
                            if (index > -1) {
                              newApprovers.splice(index, 1);
                            } else {
                              newApprovers.push(value);
                            }
                            updateFormData({
                              approval_assignees: newApprovers,
                            });
                          }}
                        >
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
            <Label htmlFor="approval_satisfaction_type">
              Does this need to be approved by one of the people on the approval
              list, or everyone?
            </Label>
            <Select
              name="approval_satisfaction_type"
              value={formData.approval_satisfaction_type || ""}
              onValueChange={(value) =>
                updateFormData({ approval_satisfaction_type: value })
              }
            >
              <SelectTrigger id="approval_satisfaction_type">
                <SelectValue placeholder="Select approval type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
};
