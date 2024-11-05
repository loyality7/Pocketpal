import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import {Searchbar, Title, Button, IconButton, Chip} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {hfStore} from '../../../store/HFStore';
import {HuggingFaceModel} from '../../../utils/types';

export const HFModelSearch = forwardRef((props, ref) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<HuggingFaceModel | null>(
    null,
  );
  const searchInputRef = useRef<any>(null);

  const searchAnimation = useRef(new Animated.Value(0)).current;
  const detailsAnimation = useRef(new Animated.Value(0)).current;
  const backdropAnimation = useRef(new Animated.Value(0)).current;

  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    handleSearch(hfStore.searchQuery);
  }, []);

  const handleSearch = async (query: string) => {
    hfStore.setSearchQuery(query);
    await hfStore.fetchModels();
  };

  useImperativeHandle(ref, () => ({
    showSearch: () => {
      showSearch();
    },
  }));

  const showSearch = () => {
    setSearchVisible(true);
    Animated.parallel([
      Animated.spring(searchAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      searchInputRef.current?.focus();
    });
  };

  const hideSearch = () => {
    Animated.parallel([
      Animated.spring(searchAnimation, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSearchVisible(false);
      setSearchQuery('');
    });
  };

  const showDetails = (model: HuggingFaceModel) => {
    setSelectedModel(model);
    setDetailsVisible(true);
    Animated.parallel([
      Animated.spring(detailsAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideDetails = () => {
    Animated.parallel([
      Animated.spring(detailsAnimation, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDetailsVisible(false);
      setSelectedModel(null);
    });
  };

  const searchTranslateY = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  const detailsTranslateY = detailsAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  const backdropOpacity = backdropAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const createPanResponder = (
    animation: Animated.Value,
    hideFunction: () => void,
  ) =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          animation.setValue(1 - gestureState.dy / screenHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > screenHeight / 3) {
          hideFunction();
        } else {
          Animated.spring(animation, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }
      },
    });

  const searchPanResponder = createPanResponder(searchAnimation, hideSearch);
  const detailsPanResponder = createPanResponder(detailsAnimation, hideDetails);

  return (
    <>
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropOpacity,
            zIndex: searchVisible || detailsVisible ? 1 : 0,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.bottomSheet,
          {transform: [{translateY: searchTranslateY}]},
          {zIndex: 2},
        ]}
        {...searchPanResponder.panHandlers}>
        <SafeAreaView style={styles.bottomSheetContent} edges={['bottom']}>
          <View style={styles.bottomSheetHeader}>
            <View style={styles.bottomSheetHeaderLine} />
          </View>
          <Searchbar
            placeholder="Search HuggingFace models"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            icon={() => <Icon name="magnify" size={24} color="#6200ee" />}
            clearIcon={() => <Icon name="close" size={24} color="#6200ee" />}
            ref={searchInputRef}
          />
          <ScrollView style={styles.searchResults}>
            {hfStore.isLoading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : hfStore.models.length === 0 ? (
              <Text style={styles.noResultsText}>No models found</Text>
            ) : (
              hfStore.models.map(model => (
                <TouchableOpacity
                  key={model.id}
                  onPress={() => showDetails(model)}
                  style={styles.modelItem}>
                  <Text style={styles.modelName}>{model.id}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Animated.View>

      {detailsVisible && selectedModel && (
        <Animated.View
          style={[
            styles.bottomSheet,
            {transform: [{translateY: detailsTranslateY}]},
            {zIndex: 3},
          ]}
          {...detailsPanResponder.panHandlers}>
          <SafeAreaView style={styles.bottomSheetContent} edges={['bottom']}>
            <View style={styles.bottomSheetHeader}>
              <View style={styles.bottomSheetHeaderLine} />
            </View>
            <ScrollView style={styles.detailsScrollView}>
              <View style={styles.modelDetails}>
                <Title style={styles.modelTitle}>{selectedModel.id}</Title>
                <View style={styles.modelStats}>
                  <Chip icon="download" style={styles.stat}>
                    {selectedModel.downloads} Downloads
                  </Chip>
                  <Chip icon="heart" style={styles.stat}>
                    {selectedModel.likes} Likes
                  </Chip>
                  {selectedModel.trendingScore > 20 && (
                    <Chip icon="trending-up" style={styles.stat}>
                      Trending
                    </Chip>
                  )}
                </View>
                <Title style={styles.sectionTitle}>Available GGUF Files</Title>
                {selectedModel.siblings.map((file, index) => (
                  <View key={index} style={styles.fileCard}>
                    <View style={styles.fileContent}>
                      <View>
                        <Text style={styles.fileName}>{file.rfilename}</Text>
                      </View>
                      <View style={styles.fileActions}>
                        <IconButton icon="plus" onPress={() => {}} />
                        <IconButton
                          icon="bookmark-outline"
                          onPress={() => {}}
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
            <Button
              mode="contained"
              onPress={hideDetails}
              style={styles.closeButton}>
              Close
            </Button>
          </SafeAreaView>
        </Animated.View>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  bottomSheetContent: {
    flex: 1,
  },
  bottomSheetHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  bottomSheetHeaderLine: {
    width: 40,
    height: 4,
    backgroundColor: '#bdbdbd',
    borderRadius: 2,
  },
  searchBar: {
    margin: 16,
    elevation: 0,
    backgroundColor: '#f0f0f0',
  },
  searchResults: {
    flex: 1,
    paddingHorizontal: 16,
  },
  modelItem: {
    paddingVertical: 12,
  },
  modelName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#757575',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#757575',
  },
  detailsScrollView: {
    flex: 1,
  },
  modelDetails: {
    padding: 16,
  },
  modelTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modelStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  stat: {
    backgroundColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  fileCard: {
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  fileContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fileActions: {
    flexDirection: 'row',
  },
  closeButton: {
    margin: 16,
  },
});
