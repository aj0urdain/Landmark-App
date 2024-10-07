"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
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

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
}

interface LiveChatProps {
  initialMessages: Message[];
  height?: number | string;
  chatName: string;
}

export default function LiveChat({
  initialMessages,
  height,
  chatName,
}: LiveChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        content: input.trim(),
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");

      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now(),
          content: "This is a simulated response from the bot.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <Card style={{ height: height }} className="flex h-full w-full flex-col">
      <CardHeader className="flex-row items-center justify-start gap-2">
        <Dot size="small" className="animate-pulse bg-green-400" />
        <h2 className="text-sm font-bold text-muted-foreground">
          Live {chatName} Chat -- UX DEMO ONLY
        </h2>
      </CardHeader>
      <ScrollArea ref={scrollAreaRef} className="flex-grow">
        <CardContent>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex animate-slide-up-fade-in items-start space-x-2 ${
                message.sender === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : "flex-row"
              }`}
            >
              <Avatar className="flex h-8 w-8 items-center justify-center">
                <AvatarImage
                  src={
                    message.sender === "user"
                      ? "/user-avatar.png"
                      : "/bot-avatar.png"
                  }
                />
                <AvatarFallback>
                  {message.sender === "user" ? "U" : "B"}
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex flex-col ${
                  message.sender === "user" ? "items-end" : "items-start"
                } max-w-[70%]`}
              >
                <span
                  className={`mb-1 text-xs text-muted-foreground ${
                    message.sender === "user" ? "self-end" : "self-start"
                  }`}
                >
                  {message.sender}
                </span>
                <div
                  className={`rounded-lg p-2 text-xs ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  } break-words`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </ScrollArea>
      <CardFooter className="flex-none">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" variant="ghost" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
