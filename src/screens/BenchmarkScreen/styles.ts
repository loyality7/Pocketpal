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
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.colors.primary,
    },
    description: {
      marginBottom: 16,
      color: theme.colors.onSurfaceVariant,
    },
    warning: {
      color: theme.colors.error,
      marginVertical: 8,
      textAlign: 'center',
    },
    button: {
      marginVertical: 6,
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
      flexWrap: 'wrap',
      gap: 8,
    },
    presetButton: {
      flex: 1,
      minWidth: 100,
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
    sectionTitle: {
      marginTop: 16,
      marginBottom: 12,
      color: theme.colors.primary,
    },
    advancedButton: {
      marginBottom: 6,
    },
    advancedDescription: {
      marginBottom: 16,
      color: theme.colors.onSurfaceVariant,
      fontSize: 12,
    },
    warningContainer: {
      backgroundColor: theme.colors.errorContainer,
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
    },
    warningList: {
      marginTop: 8,
      paddingLeft: 8,
    },
    warningText: {
      color: theme.colors.error,
      marginBottom: 4,
    },
  });
