export interface Department {
  id: number;
  department_name: string;
  description?: string;
}

export interface EnrichedDepartment extends Department {
  color?: string;
  backgroundColor?: string;
  icon?: React.ElementType;
  link?: string;
}
