import { Icon } from '@/components/atoms/TipTap/components/ui/Icon';
import { Surface } from '@/components/atoms/TipTap/components/ui/Surface';
import { Toolbar } from '@/components/atoms/TipTap/components/ui/Toolbar';
import { Tooltip } from '@/components/atoms/TipTap/components/ui/Tooltip';

export interface LinkPreviewPanelProps {
  url: string;
  onEdit: () => void;
  onClear: () => void;
}

export const LinkPreviewPanel = ({ onClear, onEdit, url }: LinkPreviewPanelProps) => {
  return (
    <Surface className="flex items-center gap-2 p-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline break-all"
      >
        {url}
      </a>
      <Toolbar.Divider />
      <Tooltip title="Edit link">
        <Toolbar.Button onClick={onEdit}>
          <Icon name="Pen" />
        </Toolbar.Button>
      </Tooltip>
      <Tooltip title="Remove link">
        <Toolbar.Button onClick={onClear}>
          <Icon name="Trash2" />
        </Toolbar.Button>
      </Tooltip>
    </Surface>
  );
};
