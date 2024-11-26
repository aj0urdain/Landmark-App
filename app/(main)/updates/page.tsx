import type { Metadata } from 'next';
import Updates from '@/components/templates/Updates/Updates';

export const metadata: Metadata = {
  title: 'Updates',
  description: 'View the latest updates and features of Landmark.',
};

export default function UpdatesPage() {
  return <Updates />;
}
