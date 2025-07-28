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
    const response = await this.apiContext.get('/bookings', {
      params: {
        caseReference: caseReference,
        courtId: this.courtId,
        sort: 'createdAt,desc',
        page: '0',
        size: '1',
      },
    });

    await expect(response).toBeOK();
    return response;
  }
}
