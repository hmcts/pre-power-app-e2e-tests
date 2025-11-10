import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export class GetBookingDetailsByCaseReferenceApi {
  private apiContext: APIRequestContext;
  private courtId: string;

  constructor(apiContext: APIRequestContext, courtId: string) {
    this.apiContext = apiContext;
    this.courtId = courtId;
  }

  /**
   * Sends a GET request to retrieve booking details by case reference.
   * @param caseReference - The case reference number to search for bookings.
   * @returns A promise that resolves to the API response containing booking details.
   */
  public async request(caseReference: string): Promise<APIResponse> {
    let response: APIResponse | undefined;
    await expect(async () => {
      response = await this.apiContext.get('/bookings', {
        params: {
          caseReference: caseReference,
          courtId: this.courtId,
          page: '0',
          size: '1',
        },
      });

      await expect(response).toBeOK();
    }).toPass({
      timeout: 25_000,
      intervals: [1_000],
    });

    if (!response) {
      throw new Error('Unable to retrieve booking details within the polling window.');
    }
    return response;
  }
}
