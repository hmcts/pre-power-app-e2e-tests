import { APIRequestContext, expect } from '@playwright/test';

type RecordingData = {
  caseIdTheRecordingBelongsTO: string;
  recordingId: string;
  recordingFilename: string;
  recordingDuration: string;
};

export class GetRecordingDetailsApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  /**
   * Fetches a list of upto 10 recordings for cases prefixed with "PR-".
   * Selects the last recording from the list and returns its details.
   * @returns A promise that resolves to an object containing the recording ID, filename, and duration.
   */
  public async request(): Promise<RecordingData> {
    const response = await this.apiContext.get('/recordings', {
      params: {
        caseReference: 'PR-', // Added pre-fix for cases created by the test suite
        sort: 'createdAt,desc',
        page: '0',
        size: '10',
      },
    });

    await expect(response).toBeOK();

    const responseBody = await response.json();
    const numberOfRecordings = responseBody._embedded?.recordingDTOList?.length;

    if (!numberOfRecordings) {
      throw new Error('No recordings found');
    }

    const recording = responseBody._embedded?.recordingDTOList?.[numberOfRecordings - 1];

    if (!recording.id || !recording.filename || !recording.duration || !recording.case_id) {
      throw new Error('Recording data is missing or incomplete');
    }

    return {
      caseIdTheRecordingBelongsTO: recording.case_id,
      recordingId: recording.id,
      recordingFilename: recording.filename,
      recordingDuration: recording.duration,
    };
  }
}
