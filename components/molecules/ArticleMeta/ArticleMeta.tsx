import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArticleDepartmentSelector } from '@/components/molecules/ArticleDepartmentSelector/ArticleDepartmentSelector';
import DepartmentBadge from '@/components/molecules/DepartmentBadge/DepartmentBadge';

interface ArticleMetaProps {
  editing: boolean;
  title: string;
  description: string;
  departments: string[];
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDepartmentsChange: (value: number[]) => void;
  titleRows: number;
  descriptionRows: number;
}

export const ArticleMeta = ({
  editing,
  title,
  description,
  departments,
  onTitleChange,
  onDescriptionChange,
  onDepartmentsChange,
  titleRows,
  descriptionRows,
}: ArticleMetaProps) => {
  return (
    <div className="flex flex-col gap-4">
      {editing ? (
        <>
          <div className="flex flex-col gap-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => {
                onTitleChange(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={descriptionRows}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Departments</Label>
            <ArticleDepartmentSelector
              value={departments}
              onChange={onDepartmentsChange}
            />
          </div>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="text-lg text-muted-foreground">{description}</p>
          <div className="flex gap-2">
            {departments.map((department) => (
              <DepartmentBadge key={department} department={department} size="small" />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
