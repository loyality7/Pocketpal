import {StyleSheet} from 'react-native';
import {Theme} from '../../../../utils/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'space-between',
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    searchBarContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    searchBar: {
      backgroundColor: theme.dark
        ? theme.colors.searchBarBackground
        : theme.colors.searchBarBackground,
      borderRadius: 16,
      height: 40,
      paddingVertical: 0,
      paddingHorizontal: 8,
    },
    searchBarInput: {
      color: theme.colors.onSurface,
      fontSize: 17,
      maxHeight: 40,
      minHeight: 40,
      height: 40,
      padding: 0,
    },
    modelItem: {
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.outlineVariant,
    },
    modelName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.onSurface,
    },
    loadingText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
    },
    noResultsText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
    },
  });
