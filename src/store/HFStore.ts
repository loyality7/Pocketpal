// store.ts
import {makeAutoObservable, runInAction} from 'mobx';
import {fetchModels} from '../api/hf';
import {HuggingFaceModel} from '../utils/types';

class HFStore {
  models: HuggingFaceModel[] = [];
  isLoading = false;
  error = '';
  nextPageLink: string | null = null; // Updated to match type
  searchQuery = ''; // Search query term
  filter = 'gguf';
  full = true;

  constructor() {
    makeAutoObservable(this);
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  private processModels(models: HuggingFaceModel[]) {
    return models.map(model => {
      const filteredSiblings =
        model.siblings?.filter(
          sibling => sibling.rfilename.toLowerCase().endsWith('.gguf'), // Filter for .gguf files
        ) || [];

      return {
        ...model,
        url: `https://huggingface.co/${model.id}`,
        siblings: filteredSiblings,
      };
    });
  }

  async fetchModels() {
    this.isLoading = true;
    this.error = '';

    try {
      const {models, nextLink} = await fetchModels({
        search: this.searchQuery,
        limit: 10,
        sort: 'downloads',
        direction: '-1',
        filter: this.filter,
        full: this.full,
      });

      const modelsWithUrl = this.processModels(models);

      runInAction(() => {
        this.models = modelsWithUrl;
        this.nextPageLink = nextLink;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to load models';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async fetchMoreModels() {
    if (!this.nextPageLink) {
      return;
    }

    this.isLoading = true;
    this.error = '';

    try {
      const {models, nextLink} = await fetchModels({
        search: this.searchQuery,
        limit: 10,
        sort: 'downloads',
        direction: '-1',
        filter: this.filter,
        full: this.full,
      });

      const modelsWithUrl = this.processModels(models);

      runInAction(() => {
        this.models = [...this.models, ...modelsWithUrl];
        this.nextPageLink = nextLink;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to load more models';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

export const hfStore = new HFStore();
