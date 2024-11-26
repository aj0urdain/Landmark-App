import { Suspense } from 'react';
import Chat from '@/components/templates/Chat/Chat';
import type { Metadata } from 'next';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Chat with your team and department.',
};

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      }
    >
      <Chat />
    </Suspense>
  );
}
