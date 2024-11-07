import React from 'react';
import {ScrollView} from 'react-native';

import {observer} from 'mobx-react';
import {Searchbar, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TouchableOpacity} from 'react-native-gesture-handler';
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

    return (
      <>
        <ScrollView style={styles.searchResults}>
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
        <SafeAreaView edges={['bottom']}>
          <Searchbar
            placeholder="Search HuggingFace models"
            onChangeText={onSearchChange}
            value={searchQuery}
            style={styles.searchBar}
            icon={() => (
              <Icon name="magnify" size={24} color={theme.colors.primary} />
            )}
            clearIcon={
              searchQuery.length > 0
                ? () => (
                    <Icon name="close" size={24} color={theme.colors.primary} />
                  )
                : undefined
            }
            ref={searchInputRef}
          />
        </SafeAreaView>
      </>
    );
  },
);
