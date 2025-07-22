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
    const response = await this.apiContext.get('/users/by-email/' + emailAddress);

    await expect(response).toBeOK();

    return response.json();
  }
}
