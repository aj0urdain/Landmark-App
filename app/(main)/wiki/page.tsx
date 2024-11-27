import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wiki',
  description: 'View the Company Wiki and internal resources.',
};

export default function WikiPage() {
  redirect('/wiki/home');
}
