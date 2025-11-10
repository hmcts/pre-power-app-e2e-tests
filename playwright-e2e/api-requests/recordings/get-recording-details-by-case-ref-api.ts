import { APIRequestContext, expect, APIResponse } from '@playwright/test';

export class GetRecordingDetailsByCaseRefApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  /**
   * Fetches recording details for a given case reference.
   * @param caseReference - The case reference to fetch recordings for.
   * @returns A promise that resolves to the API response containing recording details.
   */
  public async request(caseReference: string): Promise<APIResponse> {
    let responseData: APIResponse;

    await expect(async () => {
      const response = await this.apiContext.get('/recordings', {
        params: {
          caseReference: caseReference,
          sort: 'createdAt,desc',
          page: '0',
          size: '10',
        },
      });

      await expect(response).toBeOK();
      responseData = response;
    }).toPass({
      timeout: 25_000,
      intervals: [1_000],
    });

    return responseData!;
  }
}
