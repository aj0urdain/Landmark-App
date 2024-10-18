export function hasDepartmentAccess(
  userDepartments: string[] | null | undefined,
  requiredAccess: string[],
): boolean {
  if (requiredAccess.length === 0) return true;
  if (!userDepartments) return false;
  console.log(userDepartments);
  return userDepartments.some((dept) => requiredAccess.includes(dept));
}
