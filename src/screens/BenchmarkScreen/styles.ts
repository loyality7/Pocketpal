import {StyleSheet} from 'react-native';
import type {Theme} from '../../utils/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    scrollView: {
      flex: 1,
      padding: 16,
    },
    card: {
      marginBottom: 16,
      backgroundColor: theme.colors.surface,
    },
    title: {
      marginBottom: 8,
      color: theme.colors.primary,
    },
    description: {
      marginBottom: 16,
      color: theme.colors.onSurfaceVariant,
    },
    warning: {
      color: theme.colors.error,
      marginVertical: 16,
      textAlign: 'center',
    },
    button: {
      marginVertical: 16,
    },
    loadingContainer: {
      alignItems: 'center',
      marginVertical: 16,
    },
    loadingText: {
      marginTop: 8,
      color: theme.colors.onSurfaceVariant,
    },
    resultsContainer: {
      marginTop: 16,
    },
    resultsTitle: {
      marginBottom: 8,
      color: theme.colors.primary,
    },
    modelSelector: {
      marginBottom: 16,
    },
    modelSelectorContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modelSelectorIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    activeModelLabel: {
      marginRight: 8,
    },
    presetContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      justifyContent: 'space-around',
    },
    presetButton: {
      flex: 1,
      marginHorizontal: 4,
    },
    slidersContainer: {
      marginTop: 16,
    },
    sliderDescriptionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    settingItem: {
      marginBottom: 16,
    },
    settingLabel: {
      color: theme.colors.primary,
      marginBottom: 0,
    },
    settingValue: {
      textAlign: 'right',
      color: theme.colors.onSurface,
      marginTop: 0,
    },
    slider: {
      height: 40,
    },
  });
