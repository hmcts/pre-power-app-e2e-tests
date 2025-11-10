import { expect, APIRequestContext } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

export class CreateBookingApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  /**
   * Creates a new booking via Power App API.
   * @param caseId - The ID of the case for which the booking is being created.
   * @param witness - The witness details.
   * @param defendants - An array of defendant details.
   * @param scheduledFor - The date for which the recording is scheduled ('today' or 'tomorrow').
   * @returns A promise that returns the ID of the created booking.
   */
  public async request(
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
  ): Promise<string> {
    let idOfBooking: string | undefined;

    await expect(async () => {
      const participants = [witness, ...defendants];
      const scheduledForDate = this.getDateString(scheduledFor);
      const bookingId = uuidv4();

      const response = await this.apiContext.put(`/bookings/${bookingId}`, {
        data: {
          case_id: caseId,
          id: bookingId,
          participants,
          scheduled_for: `${scheduledForDate}T00:00:00.000Z`,
        },
      });

      await expect(response).toBeOK();
      idOfBooking = bookingId;
    }).toPass({
      timeout: 25_000,
      intervals: [1_000],
    });

    if (!idOfBooking) {
      throw new Error('Unable to create a booking within the polling window.');
    }

    return idOfBooking;
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
