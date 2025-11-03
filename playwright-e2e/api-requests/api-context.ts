import { request, APIRequestContext } from '@playwright/test';
import { config } from '../utils';

export class ApiContext {
  /**
   * Creates a new API request context for Power App API.
   * @param x_userId - The ID of the user making the request.
   * @return A promise that resolves to the API request context.
   */
  public async createPowerAppApiContext(x_userId: string): Promise<APIRequestContext> {
    return request.newContext({
      baseURL: config.urls.prePowerAppApiUrl,
      extraHTTPHeaders: {
        accept: '*/*',
        'Content-Type': 'application/json',
        'X-User-Id': x_userId,
      },
    });
  }
}
