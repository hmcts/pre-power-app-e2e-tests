import { request, APIRequestContext } from '@playwright/test';
import { config } from '../utils';

class ApiContext {
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
