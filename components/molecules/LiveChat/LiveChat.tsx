'use client';

import { useRef, useEffect, useMemo } from 'react';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dot } from '@/components/atoms/Dot/Dot';
import { Database } from '@/types/supabaseTypes';
import { createBrowserClient } from '@/utils/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { debounce } from 'lodash';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ReactTimeAgo from 'react-time-ago';

import { UserHoverCard } from './UserHoverCard/UserHoverCard';
import { Progress } from '@/components/ui/progress';
import { getDepartmentInfo } from '@/utils/getDepartmentInfo';

const MESSAGE_CHAR_LIMIT = 80;

type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type ChatRoom = Database['public']['Tables']['chat_rooms']['Row'];

type Message = Omit<ChatMessage, 'user_id' | 'chat_room_id'> & {
  user_id: UserProfile;
  chat_room_id: Pick<ChatRoom, 'id' | 'name'>;
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
  const [input, setInput] = useState('');
  const [charCount, setCharCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const supabase = createBrowserClient();
  const queryClient = useQueryClient();

  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user?.id ?? null;
    },
  });

  // get chat room data
  // Fetch chat room details
  const { data: chatRoomData } = useQuery({
    enabled: !!chatName && !!currentUser,
    queryKey: ['chat-room', chatName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select(
          `
          name, 
          id, 
          parent_room, 
          team_id,
          departments(id, department_name)
        `,
        )
        .eq('name', chatName)
        .single();

      if (error) throw new Error('Error fetching chat room');
      return data;
    },
  });

  // Get messages
  const { data: messages, isLoading: isFetchingMessages } = useQuery({
    enabled: !!chatRoomData,
    queryKey: ['chat-messages', chatName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(
          '*, chat_room_id!inner(id, name), user_id!inner(id, first_name, last_name, profile_picture)',
        )
        .eq('chat_room_id.name', chatName)
        .order('created_at', { ascending: false })
        .limit(100)
        .then((result) => ({
          ...result,
          data: result.data?.reverse(),
        }));

      if (error) throw new Error('Error fetching messages');

      return data as unknown as Message[];
    },
  });

  // Send message mutation
  const { mutate: sendMessage } = useMutation({
    mutationFn: async (messageContent: string) => {
      const { error } = await supabase.from('chat_messages').insert({
        content: messageContent,
        chat_room_id: chatRoomData?.id,
      });

      if (error) {
        console.error('Error sending message:', error);
      }
    },
    onSuccess: () => {
      setInput('');
      setCharCount(0);
    },
  });

  // Add this debounced handler
  const debouncedSendMessage = useMemo(
    () =>
      debounce((message: string) => {
        if (message.trim() && charCount <= MESSAGE_CHAR_LIMIT) {
          sendMessage(message.trim());
        }
      }, 300),
    [sendMessage, charCount],
  );

  // Setup realtime subscription
  useEffect(() => {
    if (!chatRoomData) return;

    const channels = supabase
      .channel(`chat-room-messages-${chatName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_room_id=eq.${String(chatRoomData.id)}`,
        },
        (payload) => {
          console.log('Change received!', payload);
          void queryClient.invalidateQueries({ queryKey: ['chat-messages', chatName] });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channels);
    };
  }, [supabase, chatName, queryClient, chatRoomData]);

  // Scroll to bottom effect
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]',
    );
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    debouncedSendMessage(input);
  };

  const renderMessageGroups = () => {
    if (isFetchingMessages || !messages) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      );
    }

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
          key={`group-${String(groupIndex)}`}
          className={`mb-4 flex animate-slide-up-fade-in items-start space-x-2 ${
            isCurrentUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <UserHoverCard userId={group[0].user_id.id}>
            {!isCurrentUser && (
              <Avatar
                className={`flex h-auto w-6 items-center justify-center border ${
                  hasRecentMessage ? 'border-green-400 border-opacity-50' : 'border-muted'
                }`}
              >
                <AvatarImage
                  className="h-auto w-full object-contain object-top"
                  src={group[0].user_id.profile_picture ?? undefined}
                />
                <AvatarFallback>
                  {group[0].user_id.first_name?.[0] ??
                    group[0].user_id.last_name?.[0] ??
                    'U'}
                </AvatarFallback>
              </Avatar>
            )}
          </UserHoverCard>
          <div
            className={`flex max-w-[70%] flex-col ${
              isCurrentUser ? 'items-end' : 'items-start'
            }`}
          >
            <UserHoverCard userId={group[0].user_id.id}>
              <div className="mb-1 flex cursor-pointer items-center text-xs text-muted-foreground">
                {hasRecentMessage && (
                  <Dot size="small" className="mr-1.5 animate-pulse bg-green-400" />
                )}
                <p>
                  {group[0].user_id.first_name}{' '}
                  <span className="font-bold">{group[0].user_id.last_name}</span>
                </p>
              </div>
            </UserHoverCard>
            {group.map((message, messageIndex) => (
              <TooltipProvider key={message.id}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <p
                      className={`animate-slide-up-fade-in cursor-pointer break-words rounded-lg p-2 text-xs ${
                        isCurrentUser
                          ? 'border border-secondary bg-transparent text-primary'
                          : 'bg-secondary'
                      } ${messageIndex > 0 ? 'mt-1' : ''}`}
                    >
                      {message.content}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent
                    side={isCurrentUser ? 'left' : 'right'}
                    className={`${isCurrentUser ? 'animate-slide-right-fade-in' : 'animate-slide-left-fade-in'} bg-transparent text-xs text-muted-foreground`}
                  >
                    <ReactTimeAgo date={new Date(message.created_at)} locale="en-US" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          <UserHoverCard userId={group[0].user_id.id}>
            {isCurrentUser && (
              <Avatar
                className={`flex h-auto w-6 items-center justify-center border ${
                  hasRecentMessage ? 'border-green-400 border-opacity-50' : 'border-muted'
                }`}
              >
                <AvatarImage
                  className="h-auto w-full object-contain object-top"
                  src={group[0].user_id.profile_picture ?? undefined}
                />
                <AvatarFallback>
                  {group[0].user_id.first_name?.[0] ??
                    group[0].user_id.last_name?.[0] ??
                    'U'}
                </AvatarFallback>
              </Avatar>
            )}
          </UserHoverCard>
        </div>
      );
    });
  };

  return (
    <Card
      style={{ height: height ?? '100%' }}
      className="flex h-full w-full flex-col overflow-visible"
    >
      <CardHeader>
        <div className="flex items-center justify-start gap-2 text-muted-foreground">
          <Dot size="small" className="animate-pulse bg-green-400" />
          <div className="flex items-center gap-1">
            {(() => {
              const departmentInfo = getDepartmentInfo(chatName);
              const IconComponent = departmentInfo?.icon ?? MessageSquare;
              return <IconComponent className="h-4 w-4 animate-slide-down-fade-in" />;
            })()}
            <h2 className="text-sm font-medium capitalize animate-slide-up-fade-in">
              <span className="font-bold animate-slide-up-fade-in" key={chatName}>
                {chatName}
              </span>{' '}
              Chatroom
            </h2>
          </div>
        </div>
      </CardHeader>
      <ScrollArea ref={scrollAreaRef} className="relative flex-grow h-[400px]">
        <CardContent className="overflow-visible">{renderMessageGroups()}</CardContent>
      </ScrollArea>
      <CardFooter className="flex-none">
        <div className="relative w-full">
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
                  placeholder={'Type a message...'}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setCharCount(e.target.value.length);
                  }}
                  disabled={isFetchingMessages}
                  className={charCount > MESSAGE_CHAR_LIMIT ? 'border-red-500' : ''}
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  disabled={charCount > MESSAGE_CHAR_LIMIT}
                >
                  <Send
                    className={`${
                      isFetchingMessages
                        ? 'animate-pulse text-muted-foreground [animation-duration:2s]'
                        : 'animate-slide-up-fade-in'
                    } h-4 w-4 transition-all`}
                  />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
              <Progress
                value={(charCount / MESSAGE_CHAR_LIMIT) * 100}
                className={`h-1 w-[calc(100%-40px)] ${
                  charCount > MESSAGE_CHAR_LIMIT ? 'border-2 border-destructive' : ''
                }`}
              />
            </div>
          </form>
        </div>
      </CardFooter>
    </Card>
  );
}
