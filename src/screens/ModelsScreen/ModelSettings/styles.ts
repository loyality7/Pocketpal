import {Dimensions, StyleSheet} from 'react-native';

const screenHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  chip: {
    width: 100,
    marginRight: 8,
  },
  generationPromptChip: {
    marginRight: 8,
  },
  minimalInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  chatTemplateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  chatTemplateLabel: {
    flex: 1,
  },
  chatTemplateContainer: {
    flex: 2,
    height: 20,
    overflow: 'hidden',
  },
  chatTemplateMaskContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  chatTemplatePreviewGradient: {
    flex: 1,
  },
  textArea: {
    fontSize: 12,
    lineHeight: 16,
    borderRadius: 8,
  },
  scrollView: {
    maxHeight: screenHeight * 0.4,
  },
  completionSettingsContainer: {
    marginTop: 12,
    paddingHorizontal: 2,
  },
  completionSettingsTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
});
