import { APIRequestContext, expect } from '@playwright/test';

export class CreateOrUpdateRecordingApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  /**
   * Creates or updates a recording using the Power App API.
   * @param captureSessionId - The ID of the capture session.
   * @param recordingDetails - An object containing details about the recording.
   * @param recordingDetails.recordingDuration - The duration of the recording.
   * @param recordingDetails.recordingFileName - The name of the recording file.
   * @param recordingDetails.recordingId - The ID of the recording.
   */
  public async request(
    captureSessionId: string,
    recordingDetails: {
      recordingDuration: string;
      recordingFileName: string;
      recordingId: string;
    },
  ): Promise<void> {
    const response = await this.apiContext.put(`/recordings/${recordingDetails.recordingId}`, {
      data: {
        capture_session_id: captureSessionId,
        duration: recordingDetails.recordingDuration,
        filename: recordingDetails.recordingFileName,
        id: recordingDetails.recordingId,
        version: 1,
      },
    });

    await expect(response).toBeOK();
  }
}
