import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Pencil } from 'lucide-react';

// components/ArticleHeader.tsx
interface ArticleHeaderProps {
  date: string;
  isAuthor: boolean;
  editing: boolean;
  onEditToggle: () => void;
  onDateChange: (date: Date | undefined) => void;
}

export const ArticleHeader = ({
  date,
  isAuthor,
  editing,
  onEditToggle,
  onDateChange,
}: ArticleHeaderProps) => {
  return (
    <div className="flex flex-row gap-4 items-center justify-between">
      {editing ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[280px] justify-start text-left font-normal',
                !date && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(new Date(date), 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={new Date(date)}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      ) : (
        <p className="text-muted-foreground font-medium text-lg">
          {format(new Date(date), 'eeee, dd MMMM yyyy')}
        </p>
      )}

      {isAuthor && (
        <div className="flex flex-row gap-4 items-center">
          <p className="text-sm text-muted-foreground">
            You are the author of this post!
          </p>
          <Button
            onClick={onEditToggle}
            className="text-sm flex gap-2 px-12 items-center"
          >
            <Pencil className="h-4 w-4" />
            Toggle Edit Mode
          </Button>
        </div>
      )}
    </div>
  );
};
