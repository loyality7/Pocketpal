import React, {useState, useEffect} from 'react';

import {observer} from 'mobx-react';

import {BottomSheet} from '../../../components';

import {SearchView} from './SearchView';
import {DetailsView} from './DetailsView';

import {hfStore, modelStore} from '../../../store';

import {HuggingFaceModel, ModelFile, ModelOrigin} from '../../../utils/types';

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

    const handleModelBookmark = (
      hfModel: HuggingFaceModel,
      modelFile: ModelFile,
    ) => {
      modelStore.addHFModel(hfModel, modelFile);
    };

    const isModelBookmarked = (
      hfModel: HuggingFaceModel,
      modelFile: ModelFile,
    ) => {
      return modelStore.models.some(
        model =>
          model.origin === ModelOrigin.HF &&
          model.hfModelFile?.oid === modelFile.oid,
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
              isModelBookmarked={isModelBookmarked}
            />
          )}
        </BottomSheet>
      </>
    );
  },
);
