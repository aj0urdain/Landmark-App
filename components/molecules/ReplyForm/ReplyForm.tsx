import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface ReplyFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  replyUserName: string;
}

export const ReplyForm: React.FC<ReplyFormProps> = ({
  value,
  onChange,
  onSubmit,
  onCancel,
  replyUserName,
}) => {
  return (
    <div className="mt-2 animate-slide-down-fade-in">
      <Textarea
        placeholder={`Write a reply to ${replyUserName}...`}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className="mb-2"
      />
      <div className="flex justify-end gap-2">
        <Button onClick={onSubmit}>Post Reply</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
