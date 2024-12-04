import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Menu as PaperMenu, Icon} from 'react-native-paper';

import {useTheme} from '../../hooks';

import type {MenuItemProps} from './types';
import {SubMenu} from './SubMenu';

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
  submenu,
  onSubmenuOpen,
  onSubmenuClose,
  ...menuItemProps
}) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [submenuPosition, setSubmenuPosition] = useState({x: 0, y: 0});
  const itemRef = useRef<View>(null);

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      height: 36,
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
    activeParent: {
      opacity: 0.5, // Gray out parent when submenu is open
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

  const renderSubmenuIcon = () => (
    <View style={styles.trailingContainer}>
      <Icon
        source={isSubmenuOpen ? 'chevron-down' : 'chevron-right'}
        size={18}
        color={theme.colors.menuText}
      />
    </View>
  );

  const handlePress = (e: any) => {
    if (submenu) {
      itemRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setSubmenuPosition({x: pageX + width, y: pageY});
        setIsSubmenuOpen(!isSubmenuOpen);
        if (!isSubmenuOpen) {
          onSubmenuOpen?.();
        } else {
          onSubmenuClose?.();
        }
      });
    } else {
      menuItemProps.onPress?.(e);
    }
  };

  return (
    <View ref={itemRef}>
      <PaperMenu.Item
        {...menuItemProps}
        onPress={handlePress}
        disabled={isGroupLabel || menuItemProps.disabled}
        title={label}
        style={[
          styles.container,
          isSubmenuOpen && styles.activeParent,
          isGroupLabel && styles.groupLabel,
          style,
        ]}
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
        trailingIcon={submenu ? renderSubmenuIcon : renderTrailingIcon}
      />
      {submenu && (
        <SubMenu
          visible={isSubmenuOpen}
          onDismiss={() => {
            setIsSubmenuOpen(false);
            onSubmenuClose?.();
          }}
          anchorPosition={submenuPosition}>
          {submenu}
        </SubMenu>
      )}
    </View>
  );
};
