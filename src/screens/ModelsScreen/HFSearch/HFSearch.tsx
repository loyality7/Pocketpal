import React, {useState, useRef, useEffect} from 'react';
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
import {
  FAB,
  Searchbar,
  Title,
  Button,
  IconButton,
  Chip,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {hfStore} from '../../../store/HFStore';
import {HuggingFaceModel} from '../../../utils/types';

const AnimatedFAB = Animated.createAnimatedComponent(FAB);

export default function ModelSearch() {
  const navigation = useNavigation();
  const [searchVisible, setSearchVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  //const [models, setModels] = useState<Model[]>(mockApiResponse.models);
  const [selectedModel, setSelectedModel] = useState<HuggingFaceModel | null>(
    null,
  );
  //const [loading, setLoading] = useState(false);
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

  const handleSearch = async (query: string) => {
    hfStore.setSearchQuery(query); // Set search query in store
    await hfStore.fetchModels(); // Fetch models based on the search query
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(hfStore.searchQuery); // Call handleSearch with the store's search query
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, []);

  /*const handleSearch = async (query: string) => {
    setLoading(true);
    const results = await searchModels(query);
    setModels(results);
    setLoading(false);
  };*/

  const toggleSearch = () => {
    if (searchVisible) {
      hideSearch();
    } else {
      showSearch();
    }
  };

  const showSearch = () => {
    setSearchVisible(true);
    navigation.setOptions({
      statusBarStyle: 'light',
      statusBarColor: 'rgba(0,0,0,0.5)',
      statusBarTranslucent: true,
    });
    Animated.spring(searchAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      searchInputRef.current?.focus();
    });
  };

  const hideSearch = () => {
    Animated.spring(searchAnimation, {
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      setSearchVisible(false);
      hfStore.setSearchQuery('');
      navigation.setOptions({
        statusBarStyle: 'dark',
        statusBarColor: 'transparent',
        statusBarTranslucent: true,
      });
    });
  };

  const showDetails = (model: HuggingFaceModel) => {
    setSelectedModel(model);
    setDetailsVisible(true);
    navigation.setOptions({
      statusBarStyle: 'light',
      statusBarColor: 'rgba(0,0,0,0.5)',
      statusBarTranslucent: true,
    });
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
    Animated.spring(detailsAnimation, {
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      setDetailsVisible(false);
      setSelectedModel(null);
      navigation.setOptions({
        statusBarStyle: 'dark',
        statusBarColor: 'transparent',
        statusBarTranslucent: true,
      });
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
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>HuggingFace Models</Text>
        {/* Existing content would go here */}
      </View>

      <View style={styles.fabContainer}>
        <AnimatedFAB
          icon="plus"
          label="Add Local Model"
          onPress={() => {}}
          style={[styles.fab, styles.fabAdd]}
        />
        <AnimatedFAB
          icon="refresh"
          label="Reset Models"
          onPress={() => {}}
          style={[styles.fab, styles.fabReset]}
        />
        <AnimatedFAB
          icon="magnify"
          label="Search HuggingFace"
          onPress={toggleSearch}
          style={[styles.fab, styles.fabSearch]}
        />
      </View>

      <Animated.View
        style={[
          styles.bottomSheet,
          {transform: [{translateY: searchTranslateY}]},
        ]}
        {...searchPanResponder.panHandlers}>
        <View style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeader}>
            <View style={styles.bottomSheetHeaderLine} />
          </View>
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
          <Searchbar
            placeholder="Search HuggingFace models"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            icon={() => <Icon name="magnify" size={24} color="#6200ee" />}
            clearIcon={() => <Icon name="close" size={24} color="#6200ee" />}
            ref={searchInputRef}
          />
        </View>
      </Animated.View>

      {detailsVisible && selectedModel && (
        <Animated.View
          style={[
            styles.bottomSheet,
            {transform: [{translateY: detailsTranslateY}]},
          ]}
          {...detailsPanResponder.panHandlers}>
          <View style={styles.bottomSheetContent}>
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
                        {/*<Text style={styles.fileSize}>{file.size}</Text>*/}
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
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  fab: {
    marginBottom: 16,
  },
  fabAdd: {
    backgroundColor: '#4CAF50',
  },
  fabReset: {
    backgroundColor: '#FFC107',
  },
  fabSearch: {
    backgroundColor: '#2196F3',
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
  searchResults: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchBar: {
    margin: 16,
    elevation: 0,
    backgroundColor: '#f0f0f0',
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
  fileSize: {
    fontSize: 14,
    color: '#757575',
  },
  fileActions: {
    flexDirection: 'row',
  },
  closeButton: {
    margin: 16,
  },
});
