import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfileCard } from '@/components/molecules/UserProfileCard/UserProfileCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/queries/users/hooks';
import ReactTimeAgo from 'react-time-ago';
import { SmilePlus, Users } from 'lucide-react';

interface Reaction {
  user_id: string;
  react_type?: string;
  created_at: string;
}

interface ReactionDetailsDialogProps {
  reactions: Reaction[];
  trigger: React.ReactNode;
  title?: string;
}

const allReactions = {
  like: { emoji: '👍' },
  love: { emoji: '❤️' },
  laugh: { emoji: '😂' },
  fire: { emoji: '🔥' },
  sad: { emoji: '😢' },
};

export function ReactionDetailsDialog({
  reactions,
  trigger,
  title = 'Reactions',
}: ReactionDetailsDialogProps) {
  // Group reactions by type
  const reactionsByType = Object.entries(allReactions).reduce(
    (acc, [type, { emoji }]) => {
      const typeReactions = reactions.filter((r) => r.react_type === type);
      if (typeReactions.length > 0) {
        acc[type] = {
          emoji,
          reactions: typeReactions,
        };
      }
      return acc;
    },
    {} as Record<string, { emoji: string; reactions: Reaction[] }>,
  );

  const activeReactionTypes = Object.keys(reactionsByType);
  const defaultTab = activeReactionTypes[0];

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center flex-row gap-2 text-muted-foreground">
            <SmilePlus className="h-4 w-4" />
            {reactions.length} {title}
          </DialogTitle>
          <DialogDescription>{/* placeholder for no error */}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="w-full justify-start bg-muted/20">
            {Object.entries(reactionsByType).map(([type, { emoji, reactions }]) => (
              <TabsTrigger key={type} value={type} className="gap-1">
                {emoji} {reactions.length}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(reactionsByType).map(([type, { reactions }]) => (
            <TabsContent
              key={type}
              value={type}
              className="mt-4 animate-slide-down-fade-in"
            >
              <ScrollArea className="h-[300px] pr-4">
                <div className="flex flex-col gap-4 h-fit">
                  {reactions.map((reaction) => (
                    <ReactionUser
                      key={reaction.user_id}
                      userId={reaction.user_id}
                      timestamp={reaction.created_at}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function ReactionUser({ userId, timestamp }: { userId: string; timestamp: string }) {
  const { data: user } = useUser(userId);

  if (!user) return null;

  return (
    <div className="flex items-center justify-between overflow-visible h-full">
      <UserProfileCard
        id={userId}
        showName
        showAvatar
        variant="minimal"
        avatarSize="sm"
        textSize="base"
        avatarPopOut={false}
      />
      <span className="text-xs text-muted-foreground">
        <ReactTimeAgo date={new Date(timestamp)} />
      </span>
    </div>
  );
}
