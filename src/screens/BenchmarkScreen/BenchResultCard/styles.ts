import {StyleSheet} from 'react-native';
import type {Theme} from '../../../utils/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    resultCard: {
      marginTop: 8,
      backgroundColor: theme.colors.authorBubbleBackground,
    },
    configLabel: {
      color: theme.colors.primary,
      marginTop: 2,
    },
    resultHeader: {
      marginBottom: 8,
    },
    modelDesc: {
      marginBottom: 4,
    },
    modelInfo: {
      flexDirection: 'row',
      color: theme.colors.onSurfaceVariant,
      marginBottom: 8,
    },
    benchmarkParams: {
      marginBottom: 8,
    },
    benchmarkResults: {
      marginTop: 4,
    },
    paramRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    paramLabel: {
      flex: 1,
    },
    timestamp: {
      color: theme.colors.onSurfaceVariant,
    },
    resultDetails: {
      //backgroundColor: theme.colors.surface,
      //borderRadius: 4,
      //padding: 8,
    },

    resultRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
