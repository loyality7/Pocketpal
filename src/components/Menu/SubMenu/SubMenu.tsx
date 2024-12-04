import React from 'react';

import {Menu as PaperMenu} from 'react-native-paper';

import {useTheme} from '../../../hooks';

import {createStyles} from './styles';

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
