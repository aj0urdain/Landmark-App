import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createBrowserClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, X } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import {
  agentsDataOptions,
  updateAgents,
  Agent,
} from '@/utils/sandbox/document-generator/portfolio-page/portfolio-queries';
import { agentsConfig } from '@/lib/agentsConfig';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface DocumentData {
  document_data: {
    agentsData: {
      agents: Agent[];
    };
    [key: string]: unknown;
  };
  id: string;
}

const AgentsControls: React.FC = () => {
  const [comboboxValue, setComboboxValue] = useState('');
  const [customAgentName, setCustomAgentName] = useState('');
  const [customAgentPhone, setCustomAgentPhone] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [databaseMessage, setDatabaseMessage] = useState<{
    status: 'success' | 'pending' | 'error';
    message: string;
  } | null>(null);

  const queryClient = useQueryClient();
  const supabase = createBrowserClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  // Get the persisted document data
  const { data: documentData, isLoading } = useQuery<DocumentData>({
    queryKey: ['document', selectedListingId, selectedDocumentType],
  });

  // Get the draft agents
  const draftAgents = queryClient.getQueryData([
    'draftAgents',
    selectedListingId,
    selectedDocumentType,
  ]);

  // Initialize draft agents if they don't exist
  useEffect(() => {
    if (documentData.document_data.agentsData && !draftAgents) {
      queryClient.setQueryData(
        ['draftAgents', selectedListingId, selectedDocumentType],
        documentData.document_data.agentsData.agents,
      );
    }
  }, [documentData, draftAgents, queryClient, selectedListingId, selectedDocumentType]);

  const updateAgentsData = async (newAgents: Agent[]) => {
    const { error } = await supabase
      .from('documents')
      .update({
        document_data: {
          ...documentData?.document_data,
          agentsData: {
            ...documentData?.document_data.agentsData,
            agents: newAgents,
          },
        },
      })
      .eq('id', documentData?.id ?? '');

    if (error) throw error;
  };

  const updateAgentsMutation = useMutation({
    mutationFn: async (newAgents: Agent[]) => {
      setDatabaseMessage({ status: 'pending', message: 'Updating agents...' });
      await updateAgentsData(newAgents);
    },
    onError: (error) => {
      console.error('Error updating agents:', error);
      setDatabaseMessage({ status: 'error', message: 'Error updating agents!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-red-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <X className="h-3 w-3" />
                <CardTitle className="text-sm">Error saving agents!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                There was an error saving your agents to the cloud!
              </CardDescription>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['document', selectedListingId, selectedDocumentType],
      });
      setDatabaseMessage({ status: 'success', message: 'Agents saved to cloud!' });
      toast.custom(
        () => (
          <Card className="text-foreground bg-background border border-green-800 max-w-72 w-full">
            <CardHeader>
              <div className="flex flex-row items-center gap-2">
                <FileCheck className="h-3 w-3" />
                <CardTitle className="text-sm">Agents updated!</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Your agents have been saved to the cloud!
              </CardDescription>
            </CardHeader>
          </Card>
        ),
        { position: 'bottom-center' },
      );
    },
  });

  const handleAgentSelect = (agentName: string) => {
    const agent = agentsConfig.find((a) => a.name === agentName);
    const currentAgents = draftAgents || [];

    if (
      agent &&
      currentAgents.length < 5 &&
      !currentAgents.some((a) => a.name === agent.name)
    ) {
      const newAgents = [...currentAgents, agent];

      // Update draft state
      queryClient.setQueryData(
        ['draftAgents', selectedListingId, selectedDocumentType],
        newAgents,
      );
      // Save to database
      updateAgentsMutation.mutate(newAgents);
      setComboboxValue('');
    }
  };

  const handleAgentRemove = (agentName: string) => {
    const currentAgents = draftAgents || [];
    const newAgents = currentAgents.filter((a) => a.name !== agentName);

    // Update draft state
    queryClient.setQueryData(
      ['draftAgents', selectedListingId, selectedDocumentType],
      newAgents,
    );
    // Save to database
    updateAgentsMutation.mutate(newAgents);
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
  };

  const handleAddCustomAgent = () => {
    if (!customAgentName || !customAgentPhone) return;
    const currentAgents = draftAgents || [];

    const formattedPhone = formatPhoneNumber(customAgentPhone);
    const newAgent: Agent = { name: customAgentName, phone: formattedPhone };

    if (
      currentAgents.length < 5 &&
      !currentAgents.some((a) => a.name === newAgent.name)
    ) {
      const newAgents = [...currentAgents, newAgent];
      // Update draft state
      queryClient.setQueryData(
        ['draftAgents', selectedListingId, selectedDocumentType],
        newAgents,
      );
      // Save to database
      updateAgentsMutation.mutate(newAgents);
      setCustomAgentName('');
      setCustomAgentPhone('');
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    if (databaseMessage) {
      const timer = setTimeout(() => {
        setDatabaseMessage(null);
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [databaseMessage]);

  if (isLoading) return null;

  // Return JSX remains largely the same, but add status indicators
  return (
    <div className="w-full space-y-4 animate-slide-down-fade-in">
      <Label htmlFor="select-agents" className="text-xs text-muted-foreground">
        {databaseMessage ? (
          <span
            className={`animate-slide-left-fade-in ${
              databaseMessage.status === 'success'
                ? 'text-green-500'
                : databaseMessage.status === 'error'
                  ? 'text-red-500'
                  : 'text-yellow-500'
            }`}
          >
            {databaseMessage.message}
          </span>
        ) : (
          <span className="animate-slide-down-fade-in">Assigned Agents</span>
        )}
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
                  onChange={(e) => {
                    setCustomAgentName(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setCustomAgentPhone(e.target.value);
                  }}
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
          {draftAgents?.map((agent, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-1">
                  <p className="font-light">{agent.name.split(' ')[0]}</p>
                  <p className="font-extrabold">{agent.name.split(' ')[1]}</p>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-muted-foreground">{agent.phone}</p>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleAgentRemove(agent.name);
                  }}
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
