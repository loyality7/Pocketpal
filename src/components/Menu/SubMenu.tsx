import React from 'react';
import {StyleSheet} from 'react-native';
import {Menu as PaperMenu} from 'react-native-paper';
import {useTheme} from '../../hooks';
import {Theme} from '../../utils/types';

interface SubMenuProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  anchorPosition?: {x: number; y: number};
}

export const SubMenu: React.FC<SubMenuProps> = ({
  visible,
  onDismiss,
  children,
  anchorPosition,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <PaperMenu
      visible={visible}
      onDismiss={onDismiss}
      anchor={anchorPosition}
      style={styles.menu}
      contentStyle={styles.content}>
      {children}
    </PaperMenu>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    menu: {
      minWidth: 220,
      marginTop: 0, // Remove negative margin
      marginLeft: 0, // Remove indent
    },
    content: {
      paddingVertical: 6,
      backgroundColor: theme.colors.menuBackground,
    },
  });
