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
    modelSelector: {},
    modelSelectorContent: {
      justifyContent: 'space-between',
      flexDirection: 'row-reverse',
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
      color: theme.colors.primary,
      marginBottom: 8,
      textTransform: 'uppercase',
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
    resultsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    deviceInfoCard: {
      marginBottom: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: 15,
    },
    deviceInfoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    deviceInfoLabel: {
      color: theme.colors.onSurfaceVariant,
    },
    deviceInfoValue: {
      color: theme.colors.onSurface,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    headerContent: {
      flex: 1,
    },
    headerSummary: {
      color: theme.colors.onSurfaceVariant,
      marginTop: 4,
    },
    section: {
      marginBottom: 16,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerIcon: {
      marginRight: 8,
    },
  });
