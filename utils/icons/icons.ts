import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export function getIconFromString(iconName: string): LucideIcon {
  // Default to a generic icon if not found
  const defaultIcon = LucideIcons.Component;

  if (!iconName) return defaultIcon;

  // Convert string to PascalCase (e.g., "check-square" to "CheckSquare")
  const pascalCase = iconName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // Direct lookup and return with fallback
  return (
    (LucideIcons as unknown as Record<string, LucideIcon>)[pascalCase] ?? defaultIcon
  );
}
