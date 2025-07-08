import * as apiRequests from './index';

export interface ApiFixtures {
  createNewCaseApi: apiRequests.CreateNewCaseApi;
}

export const apiFixtures = {
  createNewCaseApi: async ({}, use) => {
    await use(new apiRequests.CreateNewCaseApi());
  },
};
