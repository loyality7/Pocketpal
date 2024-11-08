import {StyleSheet} from 'react-native';

import {Theme} from '../../../../../utils/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    fileCard: {
      marginBottom: 8,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 8,
      padding: 8,
    },
    fileContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    fileInfo: {
      flex: 1,
      marginRight: 4,
    },
    fileName: {
      fontSize: 14,
      color: theme.colors.onSurface,
    },
    fileSize: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      marginTop: 2,
    },
    fileActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: -8, // Bring icons closer together
    },
  });
