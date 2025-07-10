import { request, APIRequestContext, expect } from '@playwright/test';
import { config } from '../../utils';
import { v4 as uuidv4 } from 'uuid';

export class CreateBookingApi {
  /**
   * Creates a new booking via Power App API.
   *
   * @param userId - The ID of the user creating the booking.
   * @param caseId - The ID of the case for which the booking is being created.
   * @param witness - The witness details.
   * @param defendants - An array of defendant details.
   * @param scheduledFor - The date for which the recording is scheduled ('today' or 'tomorrow').
   * @returns A promise that resolves when the booking is successfully created.
   */
  public async request(
    userId: string,
    caseId: string,
    witness: {
      first_name: string;
      last_name: string;
      id: string;
      participant_type: string;
    },
    defendants: {
      first_name: string;
      last_name: string;
      id: string;
      participant_type: string;
    }[],
    scheduledFor: 'today' | 'tomorrow',
  ): Promise<void> {
    const participants = [witness, ...defendants];
    const scheduledForDate = this.getDateString(scheduledFor);
    const requestId = uuidv4();

    const apiContext: APIRequestContext = await request.newContext({
      baseURL: config.urls.powerAppApiUrl,
      extraHTTPHeaders: {
        accept: '*/*',
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
    });

    const response = await apiContext.put(`/bookings/${requestId}`, {
      data: {
        case_id: caseId,
        id: requestId,
        participants,
        scheduled_for: `${scheduledForDate}T00:00:00.000Z`,
      },
    });

    await expect(response).toBeOK();
  }

  private getDateString(date: 'today' | 'tomorrow' = 'today'): string {
    const dateToUse = new Date();
    if (date === 'tomorrow') {
      dateToUse.setDate(dateToUse.getDate() + 1);
    }
    const yyyy = dateToUse.getFullYear();
    const mm = String(dateToUse.getMonth() + 1).padStart(2, '0');
    const dd = String(dateToUse.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
