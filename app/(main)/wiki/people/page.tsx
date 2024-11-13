'use server';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UsersPage } from './users-page';

export default async function PeoplePage() {
  return (
    <Card className="h-full p-6 w-full">
      <UsersPage />
    </Card>
  );
}
