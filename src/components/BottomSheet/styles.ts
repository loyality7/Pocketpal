import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    background: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      elevation: 24,
      shadowColor: theme.dark ? theme.colors.shadow : 'rgba(0, 0, 0, 0.3)',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.0,
      borderTopColor: theme.dark ? 'transparent' : theme.colors.outline,
      borderTopWidth: theme.dark ? 0 : StyleSheet.hairlineWidth,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    handle: {
      width: 32,
      height: 4,
      borderRadius: 2,
      marginVertical: 8,
      backgroundColor: theme.colors.onSurfaceVariant,
    },
    backdrop: {
      backgroundColor: theme.dark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
    },
  });
