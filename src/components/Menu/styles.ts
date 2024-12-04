import {StyleSheet} from 'react-native';

import {Theme} from '../../utils/types';

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
    menuWithSubmenu: {
      elevation: 0,
      shadowOpacity: 0,
    },
    content: {
      paddingVertical: 6,
      backgroundColor: theme.colors.menuBackground,
    },
    contentWithSubmenu: {
      backgroundColor: theme.colors.menuBackgroundDimmed,
    },
    groupSeparator: {
      height: 6,
      flexShrink: 0,
      backgroundColor: 'transparent',
    },
  });
