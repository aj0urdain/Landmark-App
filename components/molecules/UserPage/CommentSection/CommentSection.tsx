import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';

const dummyGeneralComments = [
  {
    name: 'Alice Johnson',
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Alice',
    date: '2023-06-01',
    content: 'Great work on the recent project! Your attention to detail really shows.',
  },
  {
    name: 'Bob Smith',
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Bob',
    date: '2023-05-28',
    content:
      'I appreciate your help with onboarding the new team members. You made the process smooth and efficient.',
  },
  {
    name: 'Charlie Brown',
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Charlie',
    date: '2023-05-25',
    content:
      'Your presentation at the last meeting was very insightful. Looking forward to seeing how we can implement those ideas.',
  },
];

const dummyBirthdayComments = [
  {
    name: 'David Wilson',
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=David',
    date: '2023-06-15',
    content: 'Happy birthday! Wishing you all the best on your special day.',
  },
  {
    name: 'Eva Martinez',
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Eva',
    date: '2023-06-15',
    content: 'Have a fantastic birthday! Enjoy your day to the fullest.',
  },
];

const dummyWorkAnniversaryComments = [
  {
    name: 'Frank Lee',
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Frank',
    date: '2023-06-10',
    content:
      'Congratulations on your work anniversary! Your contributions to the team have been invaluable.',
  },
  {
    name: 'Grace Kim',
    avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Grace',
    date: '2023-06-10',
    content:
      "Happy work anniversary! It's been a pleasure working with you over the years.",
  },
];

const years = ['2022', '2023', '2024'];

const CommentSectionRenderer = ({
  comments,
}: {
  comments: typeof dummyGeneralComments;
}) => (
  <div className="space-y-4">
    {comments.map((comment, index) => (
      <div key={index} className=" pb-4">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={comment.avatar} alt={comment.name} />
            <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{comment.name}</p>
            <p className="text-sm text-muted-foreground">{comment.date}</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{comment.content}</p>
      </div>
    ))}
  </div>
);

export function CommentSection() {
  const [newComment, setNewComment] = useState('');
  const [selectedBirthdayYear, setSelectedBirthdayYear] = useState('');
  const [selectedAnniversaryYear, setSelectedAnniversaryYear] = useState('');
  const [activeSection, setActiveSection] = useState('general');

  const handlePostComment = () => {
    // Implement post comment logic here
    console.log('Posting comment:', newComment);
    setNewComment('');
  };

  return (
    <div className="flex w-full gap-4">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle className="text-2xl">Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => {
              setActiveSection('general');
            }}
          >
            General
          </Button>
          <Combobox
            options={years.map((year) => ({ value: year, label: year }))}
            placeholder="Select birthday year..."
            onSelect={(value) => {
              setSelectedBirthdayYear(value);
              setActiveSection('birthdays');
            }}
            selectedValue={selectedBirthdayYear}
          />
          <Combobox
            options={years.map((year) => ({ value: year, label: year }))}
            placeholder="Select anniversary year..."
            onSelect={(value) => {
              setSelectedAnniversaryYear(value);
              setActiveSection('work_anniversaries');
            }}
            selectedValue={selectedAnniversaryYear}
          />
        </CardContent>
      </Card>

      <Card className="w-2/3">
        <CardHeader className="sticky top-0 z-10 bg-background">
          <CardTitle className="text-2xl">
            {activeSection === 'general'
              ? 'General Comments'
              : activeSection === 'birthdays'
                ? `Birthday Comments (${selectedBirthdayYear})`
                : `Work Anniversary Comments (${selectedAnniversaryYear})`}
          </CardTitle>
          <div className="flex space-x-2">
            <Input
              placeholder="Post a comment..."
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
              }}
            />
            <Button onClick={handlePostComment}>Post</Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-200px)]">
            {activeSection === 'general' && (
              <CommentSectionRenderer comments={dummyGeneralComments} />
            )}
            {activeSection === 'birthdays' && (
              <CommentSectionRenderer comments={dummyBirthdayComments} />
            )}
            {activeSection === 'work_anniversaries' && (
              <CommentSectionRenderer comments={dummyWorkAnniversaryComments} />
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
