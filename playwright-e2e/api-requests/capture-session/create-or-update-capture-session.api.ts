import { expect, APIRequestContext } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

type CaptureSessionData = {
  captureSessionId: string;
  sessionDateTime: string;
};
export class CreateOrUpdateCaptureSessionApi {
  private apiContext: APIRequestContext;
  private userId: string;

  constructor(apiContext: APIRequestContext, userId: string) {
    this.apiContext = apiContext;
    this.userId = userId;
  }

  /**
   * Creates or updates a capture session based on the action specified.
   * @param bookingId - The booking ID associated with the capture session.
   * @param action - The action to perform: 'STANDBY' to create a new session, or 'RECORDING_AVAILABLE' to update an existing session.
   * @param captureSessionId - Optional, the ID of the capture session to update (required for 'Complete').
   * @returns A promise that resolves to the capture session ID.
   */
  public async request(bookingId: string, action: 'STANDBY' | 'RECORDING_AVAILABLE', captureSessionId?: string): Promise<CaptureSessionData> {
    let CaptureSessionData: CaptureSessionData | undefined;

    await expect(async () => {
      const dateTimeNow = new Date().toISOString();
      let requestBody: object;

      switch (action) {
        case 'STANDBY':
          captureSessionId = uuidv4();
          requestBody = {
            booking_id: bookingId,
            id: captureSessionId,
            origin: 'PRE',
            status: 'STANDBY',
          };
          break;
        case 'RECORDING_AVAILABLE':
          if (!captureSessionId) {
            throw new Error('captureSessionId is required for completing a session');
          }
          requestBody = {
            booking_id: bookingId,
            finished_at: dateTimeNow,
            finished_by_user_id: this.userId,
            id: captureSessionId,
            origin: 'PRE',
            started_at: dateTimeNow,
            started_by_user_id: this.userId,
            status: 'RECORDING_AVAILABLE',
          };
          break;
        default:
          throw new Error(`Unknown action: '${action}'`);
      }

      const response = await this.apiContext.put(`/capture-sessions/${captureSessionId}`, {
        data: requestBody,
      });
      await expect(response).toBeOK();

      CaptureSessionData = {
        captureSessionId: captureSessionId,
        sessionDateTime: dateTimeNow,
      };
    }).toPass({
      timeout: 25_000,
      intervals: [1_000],
    });

    if (!CaptureSessionData) {
      throw new Error('Unable to capture the session data, within the polling window.');
    }

    return CaptureSessionData;
  }
}
