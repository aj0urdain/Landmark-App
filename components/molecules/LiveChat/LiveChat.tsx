"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dot } from "@/components/atoms/Dot/Dot";
import { Database } from "@/types/supabaseTypes";
import { createBrowserClient } from "@/utils/supabase/client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReactTimeAgo from "react-time-ago";

import { ChatUserHoverCard } from "./ChatUserHoverCard/ChatUserHoverCard";
import { Progress } from "@/components/ui/progress";

const MESSAGE_CHAR_LIMIT = 80;

type ChatMessage = Database["public"]["Tables"]["chat_messages"]["Row"];
type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
type ChatRoom = Database["public"]["Tables"]["chat_rooms"]["Row"];

type Message = Omit<ChatMessage, "user_id" | "chat_room_id"> & {
  user_id: UserProfile;
  chat_room_id: Pick<ChatRoom, "id" | "name">;
};

interface LiveChatProps {
  height?: number | string;
  chatName: string;
}

const EmptyStateMessage = () => (
  <div className="flex h-full w-full items-center justify-start">
    <p className="text-sm text-muted-foreground/50">
      No messages yet. Be the first to say hello!
    </p>
  </div>
);

export default function LiveChat({ height, chatName }: LiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const supabase = createBrowserClient();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [floatingMessage, setFloatingMessage] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user?.id || null);
    };
    fetchCurrentUser();
  }, [supabase]);

  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select(
        "*, chat_room_id!inner(id, name), user_id!inner(id, first_name, last_name, profile_picture)",
      )
      .eq("chat_room_id.name", chatName)
      .order("created_at", { ascending: false }) // Change to descending order
      .limit(100) // Limit to 100 messages
      .then((result) => ({
        ...result,
        data: result.data?.reverse(), // Reverse the array to maintain chronological order
      }));

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data as unknown as Message[]);
    }
  }, [chatName, supabase]);

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_messages",
        },
        () => {
          fetchMessages();
          // Clear the floating message when new messages are received
          setFloatingMessage(null);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatName, supabase, fetchMessages]);

  const handleSend = useCallback(async () => {
    if (input.trim() && !isSending && charCount <= MESSAGE_CHAR_LIMIT) {
      setIsSending(true);
      const messageContent = input.trim();
      setInput("");
      setCharCount(0);
      setFloatingMessage(messageContent);

      try {
        const { data: chatRoomData, error: chatRoomError } = await supabase
          .from("chat_rooms")
          .select("id")
          .eq("name", chatName)
          .single();

        if (chatRoomError) throw new Error("Error fetching chat room");

        const { error } = await supabase.from("chat_messages").insert({
          content: messageContent,
          chat_room_id: chatRoomData.id,
        });

        if (error) throw new Error("Error sending message");

        // Don't call fetchMessages here, let the subscription handle it
      } catch (error) {
        console.error("Error:", error);
        // Optionally, show an error message to the user
      } finally {
        setIsSending(false);
        // Refocus on the input field
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  }, [input, isSending, supabase, chatName, charCount]);

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const renderMessageGroups = useCallback(() => {
    if (messages.length === 0) {
      return <EmptyStateMessage />;
    }

    let currentGroup: Message[] = [];
    const groups: Message[][] = [];

    messages.forEach((message, index) => {
      if (
        index === 0 ||
        message.user_id.id !== messages[index - 1].user_id.id ||
        currentGroup.length >= 4
      ) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups.map((group, groupIndex) => {
      const isCurrentUser = currentUser === group[0].user_id.id;
      const hasRecentMessage = group.some((message) => {
        const messageTime = new Date(message.created_at);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        return messageTime > fiveMinutesAgo;
      });

      return (
        <div
          key={`group-${groupIndex}`}
          className={`mb-4 flex animate-slide-up-fade-in items-start space-x-2 ${
            isCurrentUser ? "justify-end" : "justify-start"
          }`}
        >
          <ChatUserHoverCard userId={group[0].user_id.id}>
            {!isCurrentUser && (
              <Avatar
                className={`flex h-auto w-6 items-center justify-center border ${
                  hasRecentMessage
                    ? "border-green-400 border-opacity-50"
                    : "border-muted"
                }`}
              >
                <AvatarImage
                  className="h-auto w-full object-contain object-top"
                  src={group[0].user_id.profile_picture || undefined}
                />
                <AvatarFallback>
                  {group[0].user_id.first_name?.[0] ||
                    group[0].user_id.last_name?.[0] ||
                    "U"}
                </AvatarFallback>
              </Avatar>
            )}
          </ChatUserHoverCard>
          <div
            className={`flex max-w-[70%] flex-col ${
              isCurrentUser ? "items-end" : "items-start"
            }`}
          >
            <ChatUserHoverCard userId={group[0].user_id.id}>
              <span className="mb-1 flex cursor-pointer items-center text-xs text-muted-foreground">
                {hasRecentMessage && (
                  <Dot
                    size="small"
                    className="mr-1.5 animate-pulse bg-green-400"
                  />
                )}
                {group[0].user_id.first_name} {group[0].user_id.last_name}
              </span>
            </ChatUserHoverCard>
            {group.map((message, messageIndex) => (
              <TooltipProvider key={message.id}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <p
                      className={`animate-slide-up-fade-in cursor-pointer break-words rounded-lg p-2 text-xs ${
                        isCurrentUser
                          ? "border border-secondary bg-transparent text-primary"
                          : "bg-secondary"
                      } ${messageIndex > 0 ? "mt-1" : ""}`}
                    >
                      {message.content}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent
                    side={isCurrentUser ? "left" : "right"}
                    className={`${isCurrentUser ? "animate-slide-right-fade-in" : "animate-slide-left-fade-in"} bg-transparent text-xs text-muted-foreground`}
                  >
                    <ReactTimeAgo
                      date={new Date(message.created_at)}
                      locale="en-US"
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          <ChatUserHoverCard userId={group[0].user_id.id}>
            {isCurrentUser && (
              <Avatar
                className={`flex h-auto w-6 items-center justify-center border ${
                  hasRecentMessage
                    ? "border-green-400 border-opacity-50"
                    : "border-muted"
                }`}
              >
                <AvatarImage
                  className="h-auto w-full object-contain object-top"
                  src={group[0].user_id.profile_picture || undefined}
                />
                <AvatarFallback>
                  {group[0].user_id.first_name?.[0] ||
                    group[0].user_id.last_name?.[0] ||
                    "U"}
                </AvatarFallback>
              </Avatar>
            )}
          </ChatUserHoverCard>
        </div>
      );
    });
  }, [messages, currentUser]);

  const FloatingMessage = useCallback(() => {
    if (!floatingMessage) return null;

    return (
      <div className="absolute bottom-full left-0 mb-2 animate-float-up-fade-out">
        <div className="mx-auto w-full rounded-lg border border-muted-foreground bg-transparent p-2 text-xs text-primary">
          {floatingMessage}
        </div>
      </div>
    );
  }, [floatingMessage]);

  useEffect(() => {
    if (floatingMessage) {
      const timer = setTimeout(() => setFloatingMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [floatingMessage]);

  return (
    <Card
      style={{ height: height }}
      className="flex h-full w-full flex-col overflow-visible"
    >
      <CardHeader>
        <div className="flex items-center justify-start gap-2 text-muted-foreground">
          <Dot size="small" className="animate-pulse bg-green-400" />
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <h2 className="text-sm font-bold capitalize">
              {chatName} Chatroom
            </h2>
          </div>
        </div>
      </CardHeader>
      <ScrollArea ref={scrollAreaRef} className="relative flex-grow">
        <CardContent className="overflow-visible">
          {messages.length === 0 ? (
            <EmptyStateMessage />
          ) : (
            renderMessageGroups()
          )}
        </CardContent>
      </ScrollArea>
      <CardFooter className="flex-none">
        <div className="relative w-full">
          <FloatingMessage />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex w-full flex-col items-center space-y-2"
          >
            <div className="flex w-full flex-col space-y-1">
              <div className="flex w-full items-center space-x-2">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder={isSending ? "Sending..." : "Type a message..."}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setCharCount(e.target.value.length);
                  }}
                  // disabled={isSending}
                  className={
                    charCount > MESSAGE_CHAR_LIMIT ? "border-red-500" : ""
                  }
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  disabled={isSending || charCount > MESSAGE_CHAR_LIMIT}
                >
                  <Send
                    key={isSending ? "sending" : "idle"}
                    className={`${
                      isSending
                        ? "animate-pulse text-muted-foreground [animation-duration:2s]"
                        : "animate-slide-up-fade-in"
                    } h-4 w-4 transition-all`}
                  />
                  <span className="sr-only">
                    {isSending ? "Sending" : "Send"}
                  </span>
                </Button>
              </div>
              <Progress
                value={(charCount / MESSAGE_CHAR_LIMIT) * 100}
                className={`h-1 w-[calc(100%-40px)] ${
                  charCount > MESSAGE_CHAR_LIMIT
                    ? "border-2 border-destructive"
                    : ""
                }`}
              />
            </div>
          </form>
        </div>
      </CardFooter>
    </Card>
  );
}
