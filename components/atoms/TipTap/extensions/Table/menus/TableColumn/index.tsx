import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react';
import React, { useCallback } from 'react';
import * as PopoverMenu from '@/components/atoms/TipTap/components/ui/PopoverMenu';

import { Toolbar } from '@/components/atoms/TipTap/components/ui/Toolbar';
import { isColumnGripSelected } from './utils';
import { Icon } from '@/components/atoms/TipTap/components/ui/Icon';
import {
  MenuProps,
  ShouldShowProps,
} from '@/components/atoms/TipTap/components/menus/types';

export const TableColumnMenu = React.memo(
  ({ editor, appendTo }: MenuProps): JSX.Element => {
    const shouldShow = useCallback(
      ({ view, state, from }: ShouldShowProps) => {
        if (!state) {
          return false;
        }

        return isColumnGripSelected({ editor, view, state, from: from || 0 });
      },
      [editor],
    );

    const onAddColumnBefore = useCallback(() => {
      editor.chain().focus().addColumnBefore().run();
    }, [editor]);

    const onAddColumnAfter = useCallback(() => {
      editor.chain().focus().addColumnAfter().run();
    }, [editor]);

    const onDeleteColumn = useCallback(() => {
      editor.chain().focus().deleteColumn().run();
    }, [editor]);

    return (
      <div>
        <BaseBubbleMenu
          editor={editor}
          pluginKey="tableColumnMenu"
          updateDelay={0}
          tippyOptions={{
            appendTo: () => {
              return appendTo?.current;
            },
            offset: [0, 15],
            popperOptions: {
              modifiers: [{ name: 'flip', enabled: false }],
            },
          }}
          shouldShow={shouldShow}
        >
          <Toolbar.Wrapper isVertical>
            <PopoverMenu.Item
              iconComponent={<Icon name="ArrowLeftToLine" />}
              close={false}
              label="Add column before"
              onClick={onAddColumnBefore}
            />
            <PopoverMenu.Item
              iconComponent={<Icon name="ArrowRightToLine" />}
              close={false}
              label="Add column after"
              onClick={onAddColumnAfter}
            />
            <PopoverMenu.Item
              icon="Trash"
              close={false}
              label="Delete column"
              onClick={onDeleteColumn}
            />
          </Toolbar.Wrapper>
        </BaseBubbleMenu>
      </div>
    );
  },
);

TableColumnMenu.displayName = 'TableColumnMenu';

export default TableColumnMenu;
