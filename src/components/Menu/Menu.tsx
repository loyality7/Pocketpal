import React, {useState} from 'react';

import {
  Menu as PaperMenu,
  MenuProps as PaperMenuProps,
} from 'react-native-paper';

import {useTheme} from '../../hooks';

import {createStyles} from './styles';
import {MenuItem, MenuItemProps} from './MenuItem';

const GroupSeparator = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <PaperMenu.Item
      title=""
      style={[
        styles.groupSeparator,
        {backgroundColor: theme.colors.menuGroupSeparator},
      ]}
      disabled
    />
  );
};

export interface MenuProps extends Omit<PaperMenuProps, 'anchor' | 'theme'> {
  anchor: React.ReactNode;
}

export const Menu: React.FC<MenuProps> & {
  Item: typeof MenuItem;
  GroupSeparator: typeof GroupSeparator;
} = ({anchor, children, style, ...menuProps}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [hasActiveSubmenu, setHasActiveSubmenu] = useState(false);

  const handleSubmenuOpen = () => setHasActiveSubmenu(true);
  const handleSubmenuClose = () => setHasActiveSubmenu(false);

  return (
    <PaperMenu
      {...menuProps}
      anchor={anchor}
      style={[styles.menu, hasActiveSubmenu && styles.menuWithSubmenu, style]}
      contentStyle={[
        styles.content,
        hasActiveSubmenu && styles.contentWithSubmenu,
      ]}>
      {React.Children.map(children, child =>
        React.isValidElement<MenuItemProps>(child)
          ? React.cloneElement(child, {
              onSubmenuOpen: handleSubmenuOpen,
              onSubmenuClose: handleSubmenuClose,
            })
          : child,
      )}
    </PaperMenu>
  );
};

Menu.Item = MenuItem;
Menu.GroupSeparator = GroupSeparator;
