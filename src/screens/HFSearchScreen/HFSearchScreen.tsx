import React, {useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';

import {observer} from 'mobx-react';
import {TextInput, Button, Text, IconButton, Menu} from 'react-native-paper';

import {Card} from '../../components/Card/Card';

import {hfStore} from '../../store/HFStore';

import {formatNumber, timeAgo} from '../../utils';
import {HuggingFaceModel} from '../../utils/types';

type SortOption =
  | 'author_asc'
  | 'author_desc'
  | 'downloads_asc'
  | 'downloads_desc';

type SearchParams = {
  search: string;
  author: string;
  sort: SortOption;
};

export const HFSearchScreen: React.FC = observer(() => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    search: '',
    author: '',
    sort: 'downloads_desc',
  });
  const [results, setResults] = useState<HuggingFaceModel[]>([]);
  const [savedFiles, setSavedFiles] = useState<Set<string>>(new Set());
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  const handleSearch = async () => {
    hfStore.setSearchQuery(searchParams.search); // Set the search query in the store
    await hfStore.fetchModels(); // Fetch models from hfStore
    setResults(hfStore.models); // Update local results with fetched models
  };

  /*const handleSearch = async () => {
    // Mock results for now
    const mockResults: GGUFModel[] = [
      {
        id: 'HuggingFaceTB/SmolLM2-1.7B-Instruct-GGUF',
        author: 'HuggingFaceTB',
        downloads: 931,
        likes: 100,
        lastModified: '2024-10-31T20:35:12.000Z',
        url: 'https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct-GGUF',
        siblings: [{rfilename: 'smollm2-1.7b-instruct-q4_k_m.gguf'}],
      },
      {
        id: 'unsloth/SmolLM2-1.7B-Instruct-GGUF',
        author: 'unsloth',
        downloads: 1762,
        likes: 120,
        lastModified: '2024-10-31T20:35:12.000Z',
        url: 'https://huggingface.co/unsloth/SmolLM2-1.7B-Instruct-GGUF',
        siblings: [
          {rfilename: 'SmolLM2-1.7B-Instruct-F16.gguf'},
          {rfilename: 'SmolLM2-1.7B-Instruct-Q4_K_M.gguf'},
        ],
      },
    ];

    // Sort the results based on selected option
    const sortedResults = [...mockResults].sort((a, b) => {
      switch (searchParams.sort) {
        case 'author_asc':
          return a.author.localeCompare(b.author);
        case 'author_desc':
          return b.author.localeCompare(a.author);
        case 'downloads_asc':
          return a.downloads - b.downloads;
        case 'downloads_desc':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

    setResults(sortedResults);
  };*/

  const toggleSaveFile = (modelId: string, filename: string) => {
    const fileId = `${modelId}/${filename}`;
    setSavedFiles(prev => {
      const newSet = new Set(prev);
      newSet.has(fileId) ? newSet.delete(fileId) : newSet.add(fileId);
      return newSet;
    });
  };

  const toggleCardExpansion = (modelId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      newSet.has(modelId) ? newSet.delete(modelId) : newSet.add(modelId);
      return newSet;
    });
  };

  const getSubtitle = (model: HuggingFaceModel) => {
    return (
      timeAgo(model.lastModified) +
      '  \u2022  \u2913 ' +
      formatNumber(model.downloads) +
      '  \u2022  \u2661 ' +
      formatNumber(model.likes)
    );
  };

  console.log('results', results);
  console.log('hfStore.models', hfStore.models);

  return (
    <View style={styles.container}>
      <TextInput
        label="Search GGUF models"
        value={searchParams.search}
        onChangeText={text => setSearchParams({...searchParams, search: text})}
        style={styles.input}
        mode="outlined"
      />
      {/*<TextInput
        label="Author"
        value={searchParams.author}
        onChangeText={text => setSearchParams({...searchParams, author: text})}
        style={styles.input}
        mode="outlined"
      />

      <Menu
        visible={sortMenuVisible}
        onDismiss={() => setSortMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setSortMenuVisible(true)}
            style={styles.sortButton}>
            Sort: {searchParams.sort}
          </Button>
        }>
        <Menu.Item
          onPress={() =>
            setSearchParams({...searchParams, sort: 'downloads_desc'})
          }
          title="Most Downloads"
        />
        <Menu.Item
          onPress={() =>
            setSearchParams({...searchParams, sort: 'downloads_asc'})
          }
          title="Least Downloads"
        />
        <Menu.Item
          onPress={() => setSearchParams({...searchParams, sort: 'author_asc'})}
          title="Author (A-Z)"
        />
        <Menu.Item
          onPress={() =>
            setSearchParams({...searchParams, sort: 'author_desc'})
          }
          title="Author (Z-A)"
        />
      </Menu>*/}

      <Button
        mode="contained"
        onPress={handleSearch}
        style={styles.searchButton}>
        Search
      </Button>

      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Card
            //style={styles.card}
            title={item.id}
            subtitle={getSubtitle(item)}
            url={item.url}>
            <>
              <Button
                mode="text"
                onPress={() => toggleCardExpansion(item.id)}
                contentStyle={styles.expandButton}>
                GGUF Files: {item.siblings.length}
                <IconButton
                  icon={
                    expandedCards.has(item.id) ? 'chevron-up' : 'chevron-down'
                  }
                  size={16}
                />
              </Button>

              {expandedCards.has(item.id) && (
                <View style={{paddingVertical: 0, marginVertical: 0}}>
                  {item.siblings.map((file, index) => (
                    <View key={index} style={styles.fileRow}>
                      <Text> {file.rfilename} </Text>
                      <IconButton
                        style={{
                          padding: 0,
                          margin: 0,
                        }}
                        size={16}
                        icon={
                          savedFiles.has(`${item.id}/${file.rfilename}`)
                            ? 'check'
                            : 'plus'
                        }
                        onPress={() => toggleSaveFile(item.id, file.rfilename)}
                      />
                    </View>
                  ))}
                </View>
              )}
            </>
          </Card>
        )}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  input: {marginBottom: 8},
  sortButton: {marginVertical: 8},
  searchButton: {marginBottom: 16},
  //card: {marginBottom: 10, paddingBottom: 10},
  expandButton: {flexDirection: 'row', justifyContent: 'space-between'},
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
