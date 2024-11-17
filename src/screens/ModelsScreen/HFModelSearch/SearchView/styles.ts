import {StyleSheet} from 'react-native';
import {Theme} from '../../../../utils/types';

export const createStyles = (theme: Theme, bottomInset: number) =>
  StyleSheet.create({
    contentContainer: {
      flex: 1,
      justifyContent: 'space-between',
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
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
      height: 70,
    },
    blurView: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    searchbar: {
      height: 44,
      borderRadius: 16,
      backgroundColor: theme.dark
        ? theme.colors.surfaceVariant + '80'
        : theme.colors.surface + '90',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.dark
        ? theme.colors.outline + '50'
        : theme.colors.outline + '30',
      shadowColor: theme.dark ? '#000' : 'rgba(0, 0, 0, 0.15)',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2,
      zIndex: 1, // Ensure searchbar stays above the blur
    },
    searchbarInput: {
      fontSize: 16,
      maxHeight: 44,
      minHeight: 44,
      height: 44,
      padding: 0,
      marginLeft: 8,
      color: theme.colors.onSurface,
      fontWeight: '400', // Slightly bolder
      letterSpacing: 0.25,
    },
  });
