import { Label } from '@/components/ui/label';

import { User } from '@/types/articleTypes';
import { User as UserIcon } from 'lucide-react';
import { UserProfileCard } from '../UserProfileCard/UserProfileCard';
import { UserCombobox } from '../UserCombobox/UserCombobox';
import { useEffect } from 'react';

interface ArticleAuthorsProps {
  editing: boolean;
  primaryAuthor: User;
  secondaryAuthor: User | null;
  tertiaryAuthor: User | null;
  onSecondaryAuthorChange: (userId: string | null) => void;
  onTertiaryAuthorChange: (userId: string | null) => void;
}

export const ArticleAuthors = ({
  editing,
  primaryAuthor,
  secondaryAuthor,
  tertiaryAuthor,
  onSecondaryAuthorChange,
  onTertiaryAuthorChange,
}: ArticleAuthorsProps) => {
  useEffect(() => {
    console.log(primaryAuthor);
  }, [primaryAuthor]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <UserIcon className="h-4 w-4" />
        <h2 className="text-lg font-medium">Authors</h2>
      </div>
      <div className="flex flex-col gap-4">
        <UserProfileCard id={primaryAuthor.id} showAvatar variant="minimal" />
        {editing ? (
          <>
            <div className="flex flex-col gap-2">
              <Label>Secondary Author</Label>
              <UserCombobox
                value={secondaryAuthor?.id ?? ''}
                onChange={onSecondaryAuthorChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Tertiary Author</Label>
              <UserCombobox
                value={tertiaryAuthor?.id ?? ''}
                onChange={onTertiaryAuthorChange}
              />
            </div>
          </>
        ) : (
          <>
            {secondaryAuthor && <UserProfileCard id={secondaryAuthor.id} />}
            {tertiaryAuthor && <UserProfileCard id={tertiaryAuthor.id} />}
          </>
        )}
      </div>
    </div>
  );
};
