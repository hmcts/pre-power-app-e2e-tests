import { request, APIRequestContext } from '@playwright/test';
import { config } from '../utils';

class ApiContext {
  /**
   * Creates a new API request context for Power App API.
   * @param userId - The ID of the user making the request.
   * @return A promise that resolves to the API request context.
   */
  public async createPowerAppApiContext(userId: string): Promise<APIRequestContext> {
    return request.newContext({
      baseURL: config.urls.powerAppApiUrl,
      extraHTTPHeaders: {
        accept: '*/*',
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
    });
  }
}
export default new ApiContext();
