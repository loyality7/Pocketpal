import React, {useState, useEffect} from 'react';

import {observer} from 'mobx-react';

import {BottomSheet} from '../../../components';

import {SearchView} from './SearchView';
import {DetailsView} from './DetailsView';

import {hfStore} from '../../../store';

import {HuggingFaceModel} from '../../../utils/types';

interface HFModelSearchProps {
  visible: boolean;
  onDismiss: () => void;
}

export const HFModelSearch: React.FC<HFModelSearchProps> = observer(
  ({visible, onDismiss}) => {
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedModel, setSelectedModel] = useState<HuggingFaceModel | null>(
      null,
    );

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
          />
        </BottomSheet>

        <BottomSheet
          visible={detailsVisible}
          onDismiss={() => setDetailsVisible(false)}
          snapPoints={['90%']}>
          {selectedModel && <DetailsView hfModel={selectedModel} />}
        </BottomSheet>
      </>
    );
  },
);
