import React, {useState, useEffect} from 'react';
import {View, Keyboard, Platform, StyleSheet} from 'react-native';

import {observer} from 'mobx-react';
import {Text} from 'react-native-paper';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaskedView from '@react-native-masked-view/masked-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BottomSheetFlatList, BottomSheetView} from '@gorhom/bottom-sheet';

import {BottomSheetSearchbar} from '../../../../components';

import {useTheme} from '../../../../hooks';

import {createStyles} from './styles';

import {hfStore} from '../../../../store';

import {HuggingFaceModel} from '../../../../utils/types';

interface SearchViewProps {
  onModelSelect: (model: HuggingFaceModel) => void;
  onChangeSearchQuery: (query: string) => void;
}

export const SearchView = observer(
  ({onModelSelect, onChangeSearchQuery}: SearchViewProps) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
      const keyboardWillShow = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        () => setKeyboardVisible(true),
      );
      const keyboardWillHide = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
        () => setKeyboardVisible(false),
      );

      return () => {
        keyboardWillShow.remove();
        keyboardWillHide.remove();
      };
    }, []);

    const styles = createStyles(theme, keyboardVisible ? 0 : insets.bottom);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (query: string) => {
      setSearchQuery(query);
      onChangeSearchQuery(query);
    };

    const renderItem = ({item}: {item: HuggingFaceModel}) => (
      <TouchableOpacity
        key={item.id}
        onPress={() => onModelSelect(item)}
        style={styles.modelItem}>
        <Text style={styles.modelName}>{item.id}</Text>
      </TouchableOpacity>
    );

    return (
      <BottomSheetView style={styles.contentContainer}>
        {hfStore.isLoading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : hfStore.models.length === 0 ? (
          <Text style={styles.noResultsText}>No models found</Text>
        ) : (
          <BottomSheetFlatList
            data={hfStore.models}
            keyExtractor={(item: HuggingFaceModel) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}
        <View style={styles.searchbarContainer}>
          <MaskedView
            style={StyleSheet.absoluteFill}
            maskElement={
              <LinearGradient
                style={StyleSheet.absoluteFill}
                colors={['transparent', 'black', 'black']}
                locations={[0, 0.15, 1]}
                pointerEvents="none"
              />
            }>
            <BlurView
              style={styles.blurView}
              blurType={theme.dark ? 'dark' : 'light'}
              blurAmount={3}
              /*reducedTransparencyFallbackColor={
              theme.dark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.85)'
            }*/
            />
          </MaskedView>
          <BottomSheetSearchbar
            placeholder="Search Hugging Face models"
            onChangeText={handleSearchChange}
            value={searchQuery}
            inputStyle={styles.searchbarInput}
            style={styles.searchbar}
            icon={() => (
              <Icon
                name="magnify"
                size={24}
                color={theme.colors.onSurfaceVariant}
              />
            )}
            clearIcon={
              hfStore.searchQuery.length > 0
                ? () => (
                    <Icon
                      name="close"
                      size={24}
                      color={theme.colors.onSurfaceVariant}
                    />
                  )
                : undefined
            }
          />
        </View>
      </BottomSheetView>
    );
  },
);
