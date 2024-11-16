import {StyleSheet} from 'react-native';
import {Theme} from '../../../../utils/types';

export const createStyles = (theme: Theme, bottomInset: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'space-between',
    },
    listContainer: {
      flex: 1,
      padding: 16,
    },
    list: {
      padding: 16,
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
    searchbarContainer: {
      position: 'absolute',
      bottom: bottomInset,
      left: 0,
      right: 0,
      padding: 16,
      //backgroundColor: theme.colors.searchBarBackground,
    },
    searchbar: {
      height: 40,
    },
    searchbarInput: {
      fontSize: 17,
      maxHeight: 40,
      minHeight: 40,
      height: 40,
      padding: 0,
    },
  });
