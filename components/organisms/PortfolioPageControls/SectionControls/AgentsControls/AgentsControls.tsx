import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import {
  agentsDataOptions,
  updateAgents,
  Agent,
} from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";
import { agentsConfig } from "@/lib/agentsConfig";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const AgentsControls = () => {
  const [comboboxValue, setComboboxValue] = useState("");
  const [customAgentName, setCustomAgentName] = useState("");
  const [customAgentPhone, setCustomAgentPhone] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: agentsData } = useQuery(agentsDataOptions);

  const updateAgentsMutation = useMutation({
    mutationFn: (newAgents: Agent[]) => updateAgents(newAgents, agentsData!),
    onSuccess: (newAgentsData) => {
      queryClient.setQueryData(["agentsData"], newAgentsData);
    },
  });

  const handleAgentSelect = (agentName: string) => {
    if (!agentsData) return;
    const agent = agentsConfig.find((a) => a.name === agentName);
    if (
      agent &&
      agentsData.agents.length < 5 &&
      !agentsData.agents.some((a) => a.name === agent.name)
    ) {
      updateAgentsMutation.mutate([...agentsData.agents, agent]);
      setComboboxValue("");
    }
  };

  const handleAgentRemove = (agentName: string) => {
    if (!agentsData) return;
    const updatedAgents = agentsData.agents.filter((a) => a.name !== agentName);
    updateAgentsMutation.mutate(updatedAgents);
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
  };

  const handleAddCustomAgent = () => {
    if (!agentsData || !customAgentName || !customAgentPhone) return;
    const formattedPhone = formatPhoneNumber(customAgentPhone);
    const newAgent: Agent = { name: customAgentName, phone: formattedPhone };
    if (
      agentsData.agents.length < 5 &&
      !agentsData.agents.some((a) => a.name === newAgent.name)
    ) {
      updateAgentsMutation.mutate([...agentsData.agents, newAgent]);
      setCustomAgentName("");
      setCustomAgentPhone("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <Label htmlFor="select-agents" className="text-sm font-medium">
        Assigned Agents
      </Label>
      <div className="flex gap-2">
        <Combobox
          selectedValue={comboboxValue}
          options={agentsConfig.map((agent) => ({
            value: agent.name,
            label: agent.name,
          }))}
          placeholder="Search for an agent.."
          onSelect={handleAgentSelect}
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Agent</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={customAgentName}
                  onChange={(e) => setCustomAgentName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={customAgentPhone}
                  onChange={(e) => setCustomAgentPhone(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddCustomAgent}>Add Agent</Button>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agentsData?.agents.map((agent, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{agent.name}</TableCell>
              <TableCell>{agent.phone}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAgentRemove(agent.name)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AgentsControls;
