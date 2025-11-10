import { APIRequestContext, expect } from '@playwright/test';

export class GetUserDetailsByEmailApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  /**
   * Fetches user details by email address.
   * @param emailAddress - The email address to search for.
   * @returns A promise that resolves to the response object containing user details.
   */
  public async request(emailAddress: string): Promise<object> {
    let userDetails: object | undefined;
    await expect(async () => {
      const response = await this.apiContext.get('/users/by-email/' + emailAddress);
      await expect(response).toBeOK();

      userDetails = response.json();
    }).toPass({
      timeout: 25_000,
      intervals: [1_000],
    });

    if (!userDetails) {
      throw new Error('Unable to retrieve user data within the polling window.');
    }
    return userDetails;
  }
}
