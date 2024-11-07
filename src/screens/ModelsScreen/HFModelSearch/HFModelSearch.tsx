import React, {useState, useEffect} from 'react';

import {observer} from 'mobx-react';

import {BottomSheet} from '../../../components';

import {SearchView} from './SearchView';
import {DetailsView} from './DetailsView';

import {hfStore, modelStore} from '../../../store';

import {
  HuggingFaceModel,
  Model,
  ModelFile,
  ModelOrigin,
} from '../../../utils/types';
import {Alert} from 'react-native';

interface HFModelSearchProps {
  visible: boolean;
  onDismiss: () => void;
}

export const HFModelSearch: React.FC<HFModelSearchProps> = observer(
  ({visible, onDismiss}) => {
    // const [searchVisible, setSearchVisible] = useState(false);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedModel, setSelectedModel] = useState<HuggingFaceModel | null>(
      null,
    );
    // const searchInputRef = useRef<any>(null);

    // Clear state when closed
    useEffect(() => {
      if (!visible) {
        setSearchQuery('');
        setSelectedModel(null);
      }
    }, [visible]);

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

    const handleModelSelect = async (model: HuggingFaceModel) => {
      setSelectedModel(model);
      setDetailsVisible(true);
      await hfStore.fetchModelData(model.id);
      const updatedModel = hfStore.getModelById(model.id);
      if (updatedModel) {
        setSelectedModel({...updatedModel});
      }
    };

    const handleModelUnbookmark = (modelFile: ModelFile) => {
      if (isModelBookmarked(modelFile)) {
        const model = modelStore.models.find(
          (m: Model) => m.hfModelFile?.oid === modelFile.oid,
        );
        if (model && model.isDownloaded) {
          Alert.alert(
            'Cannot Remove',
            'The model is downloaded. Please delete the file first.',
          );
        } else if (model) {
          Alert.alert(
            'Remove Model',
            'Are you sure you want to remove this model from the list?',
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Remove',
                onPress: () => {
                  const removed = modelStore.removeModelFromList(model);
                  if (!removed) {
                    Alert.alert('Error', 'Failed to remove the model.');
                  }
                },
              },
            ],
          );
        }
      }
    };

    // Add model to list
    const handleModelBookmark = (
      hfModel: HuggingFaceModel,
      modelFile: ModelFile,
    ) => {
      if (!isModelBookmarked(modelFile)) {
        modelStore.addHFModel(hfModel, modelFile);
      }
    };

    const isModelBookmarked = (modelFile: ModelFile) => {
      return modelStore.models.some(
        model =>
          model.origin === ModelOrigin.HF &&
          model.hfModelFile?.oid === modelFile.oid,
      );
    };

    const handleModelDelete = (modelFile: ModelFile) => {
      const model = modelStore.models.find(
        m => m.hfModelFile?.oid === modelFile.oid,
      );
      if (model && model.isDownloaded) {
        Alert.alert(
          'Delete Model',
          'Are you sure you want to delete this downloaded model?',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Delete',
              onPress: async () => {
                await modelStore.deleteModel(model);
              },
            },
          ],
        );
      }
    };

    const handleModelDownload = (
      hfModel: HuggingFaceModel,
      modelFile: ModelFile,
    ) => {
      if (isModelDownloaded(modelFile)) {
        Alert.alert(
          'Model Already Downloaded',
          'The model is already downloaded.',
        );
      } else {
        modelStore.downloadHFModel(hfModel, modelFile);
      }
    };

    const isModelDownloaded = (modelFile: ModelFile) => {
      return modelStore.models.some(
        model =>
          model.origin === ModelOrigin.HF &&
          model.hfModelFile?.oid === modelFile.oid &&
          model.isDownloaded,
      );
    };

    return (
      <>
        <BottomSheet
          visible={visible}
          onDismiss={onDismiss}
          snapPoints={['94%']}>
          <SearchView
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onModelSelect={handleModelSelect}
            //searchInputRef={searchInputRef}
          />
        </BottomSheet>

        <BottomSheet
          visible={detailsVisible}
          onDismiss={() => setDetailsVisible(false)}
          snapPoints={['90%']}>
          {selectedModel && (
            <DetailsView
              model={selectedModel}
              //onClose={() => setDetailsVisible(false)}
              onModelBookmark={handleModelBookmark}
              onModelUnbookmark={handleModelUnbookmark}
              isModelBookmarked={isModelBookmarked}
              onModelDownload={handleModelDownload}
              onModelDelete={handleModelDelete}
              isModelDownloaded={isModelDownloaded}
            />
          )}
        </BottomSheet>
      </>
    );
  },
);
