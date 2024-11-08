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
    modelAuthor: {
      marginBottom: 8,
    },
    modelTitle: {
      //fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 16,
      //color: theme.colors.onSurface,
    },
    modelStats: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
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
  });
