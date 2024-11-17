import { Column, ColumnDef } from '@tanstack/react-table';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  placeholder?: string;
}

export interface DataTableColumnProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}

export interface DataTableColumnHeaderProps<TData, TValue>
  extends DataTableColumnProps<TData, TValue> {
  className?: string;
}
