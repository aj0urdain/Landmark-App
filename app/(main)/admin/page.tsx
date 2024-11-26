import { redirect } from 'next/navigation';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Manage the Landmark platform.',
};

export default function AdminPage() {
  redirect('/admin/home');
}
