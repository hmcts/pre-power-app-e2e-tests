import * as apiRequests from './index';

export interface ApiFixtures {
  apiClient: apiRequests.ApiClient;
}

export const apiFixtures = {
  apiClient: async ({}, use) => {
    await use(new apiRequests.ApiClient());
  },
};
