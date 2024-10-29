import { Article } from '@/types/articleTypes';

import React from 'react';
import DepartmentBadge from '@/components/molecules/DepartmentBadge/DepartmentBadge';

const ArticleDepartments = ({
  article,
  editing,
}: {
  article: Article;
  editing: boolean;
}) => {
  return (
    <div className="flex flex-row gap-8">
      {article.departments?.map((department) => (
        <DepartmentBadge
          key={department.id}
          department={department.name}
          list
          size="large"
        />
      ))}
    </div>
  );
};

export default ArticleDepartments;
