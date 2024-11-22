import Dashboard from '@/components/templates/Dashboard/Dashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View your personalized dashboard and department information',
};

export default function DashboardPage() {
  return <Dashboard />;
}
