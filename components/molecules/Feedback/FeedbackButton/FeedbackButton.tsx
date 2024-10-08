import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BugIcon, CircleHelp, Lightbulb, Puzzle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname } from "next/navigation";
import { createBrowserClient } from "@/utils/supabase/client";
import { ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeedbackTicket {
  id: string;
  page_url: string;
  feedback_type: string;
  description: string;
  status: string;
  created_at: string;
}

interface FeedbackButtonProps {
  isCollapsed: boolean;
}

export const FeedbackButton = React.memo(function FeedbackButton({
  isCollapsed,
}: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("submit");
  const [feedbackTickets, setFeedbackTickets] = useState<FeedbackTicket[]>([]);
  const [feedbackType, setFeedbackType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState(false);

  const pathName = usePathname();
  const supabase = createBrowserClient();

  useEffect(() => {
    const fetchFeedbackTickets = async () => {
      try {
        const channels = supabase
          .channel("listen-feedback-tickets")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "feedback_tickets" },
            (payload) => {
              console.log("Change received!", payload);
              setFeedbackTickets((prevTickets) => [
                ...prevTickets,
                payload.new as FeedbackTicket,
              ]);
            },
          )
          .subscribe();
      } catch (error) {
        console.error("Error fetching feedback tickets:", error);
      }
    };

    fetchFeedbackTickets();
  }, [supabase]);

  useEffect(() => {
    setIsFormValid(feedbackType !== "" && description.length > 5);
  }, [feedbackType, description]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid) return;

    const formData = new FormData(event.currentTarget);
    const feedbackData = {
      page_url: formData.get("page-url") as string,
      feedback_type: feedbackType,
      description: description,
    };

    try {
      const { error } = await supabase
        .from("feedback_tickets")
        .insert([feedbackData]);

      if (error) throw error;

      setActiveTab("history");
      setFeedbackType("");
      setDescription("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const linkContent = (
    <>
      <BugIcon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span className="ml-3">Feedback</span>}
    </>
  );

  const linkClass = cn(
    "flex items-center py-2 text-sm font-medium border border-warning-foreground/40 rounded-md transition-all duration-200 ease-in-out",
    "text-warning-foreground hover:bg-warning-foreground/20 hover:text-foreground",
    isCollapsed ? "w-10 h-10 justify-center mx-auto" : "px-4 mx-4",
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className={linkClass}>{linkContent}</button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-start justify-start p-6 sm:h-[600px] sm:max-w-[800px]">
        <DialogHeader className="">
          <DialogTitle className="flex items-center gap-2">
            <BugIcon className="h-4 w-4" />
            Feedback
          </DialogTitle>
          <DialogDescription>
            Help Aaron improve Landmark by submitting your feedback.
          </DialogDescription>
        </DialogHeader>
        <div className="flex h-full w-full items-start justify-start">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
              <TabsTrigger value="history">Feedback History</TabsTrigger>
            </TabsList>
            <TabsContent
              value="submit"
              className="h-full animate-slide-down-fade-in"
            >
              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col justify-between space-y-8"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label
                      htmlFor="page-url"
                      className="ml-2 text-xs text-muted-foreground"
                    >
                      Page
                    </Label>
                    <Input
                      id="page-url"
                      name="page-url"
                      value={pathName}
                      readOnly
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label
                      className="ml-2 text-xs text-muted-foreground"
                      htmlFor="feedback-type"
                    >
                      Feedback Type
                    </Label>
                    <Select
                      name="feedback-type"
                      onValueChange={setFeedbackType}
                      value={feedbackType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select feedback type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bug">
                          <div className="flex items-center gap-2 text-red-500">
                            <BugIcon className="h-4 w-4" />
                            <p>Bug</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="feature-request">
                          <div className="flex items-center gap-2 text-yellow-500">
                            <Puzzle className="h-4 w-4" />
                            <p>Feature Request</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="idea">
                          <div className="flex items-center gap-2 text-green-500">
                            <Lightbulb className="h-4 w-4" />
                            <p>Idea</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="other">
                          <div className="flex items-center gap-2">
                            <CircleHelp className="h-4 w-4" />
                            <p>Other</p>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid w-full gap-1.5">
                  <Label
                    htmlFor="description"
                    className="ml-2 text-xs text-muted-foreground"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Please describe your feedback in detail. For bugs, include steps to reproduce if possible."
                    className="flex-grow"
                    rows={10}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="mt-auto flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!isFormValid}>
                    Submit Feedback
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="history">
              <div className="animate-slide-down-fade-in">
                <div className="space-y-4">
                  <div className="mt-4">
                    <Label
                      htmlFor="open-tickets"
                      className="ml-2 text-xs text-muted-foreground"
                    >
                      Open Tickets
                    </Label>
                    <div className="space-y-2">
                      {feedbackTickets
                        .filter((ticket) => ticket.status === "open")
                        .map((ticket) => (
                          <FeedbackItem
                            key={ticket.id}
                            title={ticket.description.substring(0, 50) + "..."}
                            type={ticket.feedback_type}
                            status="open"
                            date={new Date(
                              ticket.created_at,
                            ).toLocaleDateString()}
                            description={ticket.description}
                          />
                        ))}
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="closed-tickets"
                      className="ml-2 text-xs text-muted-foreground"
                    >
                      Closed Tickets
                    </Label>
                    <div className="space-y-2">
                      {feedbackTickets
                        .filter((ticket) => ticket.status === "closed")
                        .map((ticket) => (
                          <FeedbackItem
                            key={ticket.id}
                            title={ticket.description.substring(0, 50) + "..."}
                            type={ticket.feedback_type}
                            status="closed"
                            date={new Date(
                              ticket.created_at,
                            ).toLocaleDateString()}
                            description={ticket.description}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
});

interface FeedbackItemProps {
  title: string;
  type: string;
  status: "open" | "closed";
  date: string;
  description: string;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({
  title,
  type,
  status,
  date,
  description,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bug":
        return <BugIcon className="h-3 w-3" />;
      case "feature-request":
        return <Puzzle className="h-3 w-3" />;
      case "idea":
        return <Lightbulb className="h-3 w-3" />;
      default:
        return <CircleHelp className="h-3 w-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bug":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "feature-request":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "idea":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader
        className="flex cursor-pointer flex-row items-center justify-between space-y-0"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Badge className={cn("px-2 py-1", getTypeColor(type))}>
            <span className="flex items-center">
              {getTypeIcon(type)}
              <span className="ml-1 text-xs capitalize">{type}</span>
            </span>
          </Badge>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant={status === "open" ? "default" : "secondary"}
            className={cn(
              "border text-xs font-bold",
              status === "open"
                ? "border-green-700/50 bg-green-100 text-green-700 dark:border-green-300/50 dark:bg-green-900 dark:text-green-300"
                : "border-red-700/50 bg-red-100 text-red-700 dark:border-red-300/50 dark:bg-red-900 dark:text-red-300",
            )}
          >
            {status}
          </Badge>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isExpanded && "rotate-180 transform",
            )}
          />
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="animate-slide-down-fade-in">
          <div className="grid gap-1">
            <CardDescription className="text-xs text-muted-foreground">
              Submitted: {date}
            </CardDescription>
            <p className="mt-2 text-sm">{description}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
