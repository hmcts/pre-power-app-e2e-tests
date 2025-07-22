import { APIRequestContext, expect } from '@playwright/test';

export class GetCaseDetailsByCaseReferenceApi {
  private apiContext: APIRequestContext;
  private courtId: string;

  constructor(apiContext: APIRequestContext, courtId: string) {
    this.apiContext = apiContext;
    this.courtId = courtId;
  }

  /**
   * Fetches case details by case reference.
   * @param caseReference - The reference of the case to fetch details for.
   * @returns A promise that resolves to the case details.
   */
  public async request(caseReference: string): Promise<object> {
    const response = await this.apiContext.get('/cases', {
      params: {
        reference: caseReference,
        courtId: this.courtId,
        includeDeleted: 'true',
        page: '0',
        size: '1',
      },
    });

    await expect(response).toBeOK();

    const responseBody = await response.json();

    return responseBody;
  }
}
