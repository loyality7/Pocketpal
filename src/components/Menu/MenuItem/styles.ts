import {StyleSheet} from 'react-native';
import {Theme} from '../../../utils/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
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
      backgroundColor: theme.colors.menuBackgroundActive,
    },
  });
