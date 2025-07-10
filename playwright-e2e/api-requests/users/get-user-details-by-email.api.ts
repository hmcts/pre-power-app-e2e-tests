import { expect, request } from '@playwright/test';
import { config } from '../../utils';

export class GetUserDetailsByEmailApi {
  /**
   * Fetches user details by email address.
   * @param userId - The ID of the user making the request.
   * @param emailAddress - The email address to search for.
   * @returns A promise that resolves to the response object containing user details.
   */
  public async request(userId: string, emailAddress: string): Promise<object> {
    const apiContext = await request.newContext();

    const response = await apiContext.get(config.urls.powerAppApiUrl + '/users/by-email/' + emailAddress, {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
    });

    await expect(response).toBeOK();

    return response.json();
  }
}
