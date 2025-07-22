import { ApiClient, ApiContext } from './index';
import { config } from '../utils';
import { APIRequestContext } from 'playwright-core';

export interface ApiFixtures {
  apiConfig: {
    x_userId: string;
    userId: string;
    courtId: string;
  };
  apiContext: APIRequestContext;
  apiClient: ApiClient;
}

export const apiFixtures = {
  /**
   * Provides default API config values for tests.
   * You can override these values in a test using:
   *   test.use({ apiConfig: { x_userId: '...', userId: '...', courtId: '...' } })
   */
  apiConfig: async ({}, use) => {
    await use({
      x_userId: config.powerAppUsers.preLevel1User.x_userId,
      userId: config.powerAppUsers.preLevel1User.userId,
      courtId: config.powerAppUsers.preLevel1User.defaultCourtId,
    });
  },
  apiContext: async ({ apiConfig }, use) => {
    const apiContext = await new ApiContext().createPowerAppApiContext(apiConfig.x_userId);
    await use(apiContext);
  },
  apiClient: async ({ apiConfig, apiContext }, use) => {
    await use(new ApiClient(apiContext, apiConfig.userId, apiConfig.courtId));
  },
};
