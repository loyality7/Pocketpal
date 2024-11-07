import {StyleSheet} from 'react-native';

import {Theme} from '../../../../utils/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: 16,
    },
    modelTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.colors.onSurface,
    },
    modelStats: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 24,
    },
    stat: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
      color: theme.colors.onSurface,
    },
    fileCard: {
      marginBottom: 8,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 8,
      padding: 12,
    },
    fileContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    fileName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
    },
    fileSize: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginTop: 4,
    },
    fileActions: {
      flexDirection: 'row',
    },
    closeButton: {
      margin: 16,
    },
  });
