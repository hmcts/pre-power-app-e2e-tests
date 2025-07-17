import { ApiClient } from './index';

export interface ApiFixtures {
  apiClient: ApiClient;
}

export const apiFixtures = {
  apiClient: async ({}, use) => {
    await use(new ApiClient());
  },
};
