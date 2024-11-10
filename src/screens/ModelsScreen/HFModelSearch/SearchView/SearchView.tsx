import React from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {observer} from 'mobx-react';
import {Searchbar, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useTheme} from '../../../../hooks';

import {createStyles} from './styles';

import {hfStore} from '../../../../store';

import {HuggingFaceModel} from '../../../../utils/types';

interface SearchViewProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onModelSelect: (model: HuggingFaceModel) => void;
  searchInputRef?: React.RefObject<any>;
}

export const SearchView = observer(
  ({
    searchQuery,
    onSearchChange,
    onModelSelect,
    searchInputRef,
  }: SearchViewProps) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const insets = useSafeAreaInsets();

    // Calculate proper offset based on platform and UI elements
    const keyboardOffset = Platform.select({
      ios:
        (StatusBar.currentHeight || 0) + // Status bar height
        (insets.bottom || 0) + // Bottom safe area
        44 + // Standard iOS navigation bar height
        16,
      android: 0,
    });

    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={keyboardOffset}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.contentContainer}>
              <View style={styles.scrollContainer}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.scrollContent}>
                  {hfStore.isLoading ? (
                    <Text style={styles.loadingText}>Loading...</Text>
                  ) : hfStore.models.length === 0 ? (
                    <Text style={styles.noResultsText}>No models found</Text>
                  ) : (
                    hfStore.models.map(model => (
                      <TouchableOpacity
                        key={model.id}
                        onPress={() => onModelSelect(model)}
                        style={styles.modelItem}>
                        <Text style={styles.modelName}>{model.id}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
              <View style={styles.searchBarContainer}>
                <Searchbar
                  placeholder="Search HuggingFace models"
                  placeholderTextColor={theme.colors.onSurfaceVariant}
                  onChangeText={onSearchChange}
                  value={searchQuery}
                  inputStyle={styles.searchBarInput}
                  style={styles.searchBar}
                  icon={() => (
                    <Icon
                      name="magnify"
                      size={24}
                      color={theme.colors.onSurfaceVariant}
                    />
                  )}
                  clearIcon={
                    searchQuery.length > 0
                      ? () => (
                          <Icon
                            name="close"
                            size={24}
                            color={theme.colors.onSurfaceVariant}
                          />
                        )
                      : undefined
                  }
                  ref={searchInputRef}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  },
);
