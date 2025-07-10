import { expect } from '@playwright/test';
import ApiContext from '../api-context';

export class GetUserDetailsByEmailApi {
  /**
   * Fetches user details by email address.
   * @param userId - The ID of the user making the request.
   * @param emailAddress - The email address to search for.
   * @returns A promise that resolves to the response object containing user details.
   */
  public async request(userId: string, emailAddress: string): Promise<object> {
    const apiContext = await ApiContext.createPowerAppApiContext(userId);

    const response = await apiContext.get('/users/by-email/' + emailAddress);

    await expect(response).toBeOK();

    return response.json();
  }
}
