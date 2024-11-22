export interface RoutePermission {
  id: string;
  path: string;
  label: string;
  icon: string | null;
  visible: boolean | null;
  developing: boolean | null;
  parent_path: string | null;
  sort_order: number | null;
  created_at: string;
}

export interface RouteAccess {
  id: string;
  route_id: string;
  department_id: number | null;
  team_id: number | null;
  role_id: number | null;
  user_id: string | null;
  created_at: string;
}

export interface UserAccess {
  departments: number[];
  teams: number[];
  roles: number[];
}
