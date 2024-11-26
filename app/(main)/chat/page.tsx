import Chat from '@/components/templates/Chat/Chat';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Chat with your team and department.',
};

export default function ChatPage() {
  return <Chat />;
}
