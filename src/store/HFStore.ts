import {makeAutoObservable, runInAction} from 'mobx';

import {fetchGGUFSpecs, fetchModelFilesDetails, fetchModels} from '../api/hf';

import {HuggingFaceModel} from '../utils/types';
import {hasEnoughSpace, hfAsModel} from '../utils';

class HFStore {
  models: HuggingFaceModel[] = [];
  isLoading = false;
  error = '';
  nextPageLink: string | null = null;
  searchQuery = '';
  queryFilter = 'gguf';
  queryFull = true;
  queryConfig = true;

  constructor() {
    makeAutoObservable(this);
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  // Fetch the GGUF specs for a specific model,
  // such as number of parameters, context length, chat template, etc.
  async fetchAndSetGGUFSpecs(modelId: string) {
    try {
      const specs = await fetchGGUFSpecs(modelId);
      const model = this.models.find(m => m.id === modelId);
      if (model) {
        runInAction(() => {
          model.specs = specs;
        });
      }
    } catch (error) {
      console.error('Failed to fetch GGUF specs:', error);
    }
  }

  private async updateSiblingsWithFileDetails(
    model: HuggingFaceModel,
    fileDetails: any[],
  ) {
    return Promise.all(
      model.siblings.map(async file => {
        const details = fileDetails.find(
          detail => detail.path === file.rfilename,
        );
        if (!details) {
          return {...file};
        }

        const enrichedFile = {
          ...file,
          size: details.size,
          oid: details.oid,
        };

        return {
          ...enrichedFile,
          canFitInStorage: await hasEnoughSpace(hfAsModel(model, enrichedFile)),
        };
      }),
    );
  }

  // Fetch the sizes of the model files
  async fetchModelFileSizes(modelId: string) {
    try {
      console.log('Fetching model file sizes for', modelId);
      const fileDetails = await fetchModelFilesDetails(modelId);
      const model = this.models.find(m => m.id === modelId);

      if (!model) {
        return;
      }

      const updatedSiblings = await this.updateSiblingsWithFileDetails(
        model,
        fileDetails,
      );

      runInAction(() => {
        model.siblings = updatedSiblings;
      });
    } catch (error) {
      console.error('Error fetching model file sizes:', error);
    }
  }

  getModelById(id: string): HuggingFaceModel | null {
    return this.models.find(model => model.id === id) || null;
  }

  async fetchModelData(modelId: string) {
    try {
      await this.fetchAndSetGGUFSpecs(modelId);
      await this.fetchModelFileSizes(modelId);
    } catch (error) {
      console.error('Error fetching model data:', error);
    }
  }

  // Process the models to add the URL and filter our non-gguf files from the siblings
  private processModels(models: HuggingFaceModel[]) {
    return models.map(model => {
      const filteredSiblings =
        model.siblings?.filter(
          sibling => sibling.rfilename.toLowerCase().endsWith('.gguf'), // Filter for .gguf files
        ) || [];

      // Add download URL to each sibling
      const siblingsWithUrl = filteredSiblings.map(sibling => ({
        ...sibling,
        url: `https://huggingface.co/${model.id}/resolve/main/${sibling.rfilename}`,
      }));

      return {
        ...model,
        url: `https://huggingface.co/${model.id}`,
        siblings: siblingsWithUrl,
      };
    });
  }

  // Fetch the models from the Hugging Face API
  async fetchModels() {
    this.isLoading = true;
    this.error = '';

    try {
      const {models, nextLink} = await fetchModels({
        search: this.searchQuery,
        limit: 10,
        sort: 'downloads',
        direction: '-1',
        filter: this.queryFilter,
        full: this.queryFull,
        config: this.queryConfig,
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

  // Fetch the next page of models
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
        filter: this.queryFilter,
        full: this.queryFull,
        config: this.queryConfig,
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
