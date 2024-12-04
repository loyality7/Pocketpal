import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Menu as PaperMenu, Icon} from 'react-native-paper';

import {useTheme} from '../../hooks';

import type {MenuItemProps} from './types';

export const MenuItem: React.FC<MenuItemProps> = ({
  label,
  danger,
  style,
  labelStyle,
  isGroupLabel,
  icon,
  selected,
  leadingIcon,
  trailingIcon,
  ...menuItemProps
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      height: 36,
      //width: 220,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    leadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    contentContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginLeft: 0,
    },
    label: {
      ...theme.fonts.bodySmall,
      textAlign: 'left',
      paddingLeft: 0,
    },
    trailingContainer: {
      alignItems: 'flex-end',
    },
    groupLabel: {
      paddingTop: 12,
      opacity: 0.5,
    },
  });

  const renderLeadingIcon = props => (
    <View style={styles.leadingContainer}>
      {selected && <Icon source="check" size={18} />}
      {leadingIcon &&
        (typeof leadingIcon === 'function' ? (
          leadingIcon({...props, size: 18})
        ) : (
          <Icon source={leadingIcon} size={18} />
        ))}
    </View>
  );

  const renderTrailingIcon = props => (
    <View style={styles.trailingContainer}>
      {trailingIcon ? (
        typeof trailingIcon === 'function' ? (
          trailingIcon({...props, size: 18})
        ) : (
          <Icon source={trailingIcon} size={18} />
        )
      ) : icon ? (
        <Icon source={icon} size={18} />
      ) : null}
    </View>
  );

  return (
    <PaperMenu.Item
      {...menuItemProps}
      disabled={isGroupLabel || menuItemProps.disabled}
      title={label}
      style={[styles.container, isGroupLabel && styles.groupLabel, style]}
      dense
      contentStyle={styles.contentContainer}
      titleStyle={[
        styles.label,
        {
          color: danger ? theme.colors.menuDangerText : theme.colors.menuText,
        },
        labelStyle,
      ]}
      leadingIcon={renderLeadingIcon}
      trailingIcon={renderTrailingIcon}
    />
  );
};
