import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const GenericDepartmentEventsCard = ({
  departmentID,
  departmentName,
}: {
  departmentID: number;
  departmentName: string;
}) => {
  const { data: departmentData } = useQuery({
    queryKey: ['department', departmentName],
  });

  return (
    <Card className="row-span-1 flex h-1/2 flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {departmentData?.department_name} Events
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col text-sm text-muted">
        <p>Possible table of events?</p>
        <p>May include filter to change upcoming events via day/week/month</p>
      </CardContent>
    </Card>
  );
};

export default GenericDepartmentEventsCard;
