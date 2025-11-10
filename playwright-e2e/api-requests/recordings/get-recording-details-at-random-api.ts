import { APIRequestContext, expect } from '@playwright/test';

type RecordingData = {
  caseIdTheRecordingBelongsTO: string;
  recordingId: string;
  recordingFilename: string;
  recordingDuration: string;
};

export class GetRecordingDetailsAtRandomApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  /**
   * Fetches a list of upto 20 recordings for cases prefixed with "PR-".
   * Selects one recording at random from the list and returns its details.
   * @returns A promise that resolves to an object containing the recording ID, filename, and duration.
   */
  public async request(): Promise<RecordingData> {
    let recordingData: RecordingData;

    await expect(async () => {
      const response = await this.apiContext.get('/recordings', {
        params: {
          caseReference: 'PR-', // Added pre-fix for cases created by the test suite
          sort: 'createdAt,desc',
          page: '0',
          size: '20',
        },
      });

      await expect(response).toBeOK();

      const responseBody = await response.json();
      const numberOfRecordings = responseBody._embedded?.recordingDTOList?.length;
      let recordingToSelectAtRandom: number = 0;

      if (!numberOfRecordings) {
        throw new Error('No recordings found');
      } else if (numberOfRecordings > 1) {
        recordingToSelectAtRandom = Math.floor(Math.random() * (numberOfRecordings - 1)) + 2;
      }
      const recording = responseBody._embedded?.recordingDTOList?.[recordingToSelectAtRandom];

      if (!recording.id || !recording.filename || !recording.duration || !recording.case_id) {
        throw new Error('Recording data is missing or incomplete');
      }

      recordingData = {
        caseIdTheRecordingBelongsTO: recording.case_id,
        recordingId: recording.id,
        recordingFilename: recording.filename,
        recordingDuration: recording.duration,
      };
    }).toPass({
      timeout: 25_000,
      intervals: [1_000],
    });

    return recordingData!;
  }
}
