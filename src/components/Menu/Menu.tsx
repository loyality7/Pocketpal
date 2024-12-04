import React from 'react';
import {StyleSheet} from 'react-native';

import {Menu as PaperMenu} from 'react-native-paper';

import {useTheme} from '../../hooks';

import {MenuItem} from './MenuItem';
import type {MenuProps} from './types';

import type {Theme} from '../../utils/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    menu: {
      minWidth: 200,
      borderRadius: 13,
      shadowColor: 'rgba(0, 0, 0, 0.05)',
      shadowRadius: 70,
      shadowOffset: {width: 0, height: 0},
      elevation: 5,
    },
    content: {
      paddingTop: 6,
      paddingBottom: 6,
      backgroundColor: theme.colors.menuBackground,
    },
    groupSeparator: {
      height: 6,
      flexShrink: 0,
      backgroundColor: 'transparent',
    },
  });

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

export const Menu: React.FC<MenuProps> & {
  Item: typeof MenuItem;
  GroupSeparator: typeof GroupSeparator;
} = ({anchor, children, style, ...menuProps}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <PaperMenu
      {...menuProps}
      anchor={anchor}
      style={[styles.menu, style]}
      contentStyle={styles.content}>
      {children}
    </PaperMenu>
  );
};

Menu.Item = MenuItem;
Menu.GroupSeparator = GroupSeparator;
