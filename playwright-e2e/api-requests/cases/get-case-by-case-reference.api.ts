import { expect } from '@playwright/test';
import ApiContext from '../api-context';

export class GetCaseDeatilsByCaseReferenceApi {
  /**
   * Fetches case details by case reference.
   * @param userId - The ID of the user making the request.
   * @param courtId - The ID of the court to which the case belongs.
   * @param caseReference - The reference number of the case to be fetched.
   * @return A promise that resolves to the case details response.
   */
  public async request(userId: string, courtId: string, caseReference: string): Promise<object> {
    const apiContext = await ApiContext.createPowerAppApiContext(userId);

    const response = await apiContext.get('/cases', {
      params: {
        reference: caseReference,
        courtId: courtId,
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
