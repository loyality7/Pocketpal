import React from 'react';
import {StyleSheet} from 'react-native';
import {Menu as PaperMenu} from 'react-native-paper';
import type {MenuItemProps} from './types';
import {useTheme} from '../../hooks';

export const MenuItem: React.FC<MenuItemProps> = ({
  label,
  danger,
  style,
  labelStyle,
  isGroupLabel,
  ...menuItemProps
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      height: 36,
      minWidth: 200,
      paddingHorizontal: 13,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexShrink: 0,
    },
    label: {
      ...theme.fonts.bodySmall,
      textAlignVertical: 'center',
      textAlign: 'left',
    },
    groupLabel: {
      paddingTop: 12,
      opacity: 0.5,
    },
  });

  return (
    <PaperMenu.Item
      {...menuItemProps}
      disabled={isGroupLabel || menuItemProps.disabled}
      title={label}
      style={[styles.container, isGroupLabel && styles.groupLabel, style]}
      titleStyle={[
        styles.label,
        {
          color: danger ? theme.colors.menuDangerText : theme.colors.menuText,
        },
        labelStyle,
      ]}
    />
  );
};
