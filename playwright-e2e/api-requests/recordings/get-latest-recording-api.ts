import { APIRequestContext, expect } from '@playwright/test';

type RecordingData = {
  recordingId: string;
  recordingFilename: string;
  recordingDuration: string;
};

export class GetLatestRecordingApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  /**
   * Fetches the latest recording for cases prefixed with "PR-".
   * @returns A promise that resolves to an object containing the recording ID, filename, and duration.
   */
  public async request(): Promise<RecordingData> {
    const response = await this.apiContext.get('/recordings', {
      params: {
        caseReference: 'PR-', // Added pre-fix for cases created by the test suite in order to obtain the latest recording
        sort: 'createdAt,desc',
        page: '0',
        size: '1',
      },
    });

    await expect(response).toBeOK();

    const responseBody = await response.json();
    const latestRecording = responseBody._embedded?.recordingDTOList?.[0];

    if (!latestRecording || !latestRecording.id || !latestRecording.filename || !latestRecording.duration) {
      throw new Error('Latest recording data is missing or incomplete');
    }

    return {
      recordingId: latestRecording.id,
      recordingFilename: latestRecording.filename,
      recordingDuration: latestRecording.duration,
    };
  }
}
