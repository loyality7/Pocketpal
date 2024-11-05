// api/hf.ts
import axios from 'axios';
import {HuggingFaceModel, HuggingFaceModelsResponse} from '../utils/types';

const BASE_URL = 'https://huggingface.co/api/models';

export async function fetchModels({
  search,
  author,
  filter,
  sort,
  direction,
  limit,
  full,
  config,
}: {
  search?: string;
  author?: string;
  filter?: string;
  sort?: string;
  direction?: string;
  limit?: number;
  full?: boolean;
  config?: boolean;
}): Promise<HuggingFaceModelsResponse> {
  try {
    console.log('search', search);
    console.log('author', author);
    console.log('filter', filter);
    console.log('sort', sort);
    console.log('direction', direction);
    console.log('limit', limit);
    console.log('full', full);
    console.log('config', config);
    const response = await axios.get(BASE_URL, {
      params: {
        search,
        author,
        filter,
        sort,
        direction,
        limit,
        full,
        config,
      },
    });
    //console.log('response', response);
    return {
      models: response.data as HuggingFaceModel[],
      nextLink: response.headers.link || null, // null if no pagination link is provided
    };
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
}
