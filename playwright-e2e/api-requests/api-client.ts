import { APIRequestContext, expect } from '@playwright/test';
import { BookingDetails, CreatedCaseSummary, RecordingDetails } from '../types';
import {
  CreateNewCaseApi,
  CreateBookingApi,
  GetCaseDetailsByCaseReferenceApi,
  CreateOrUpdateCaptureSessionApi,
  GetLatestRecordingApi,
  CreateOrUpdateRecordingApi,
} from './index.js';

export class ApiClient {
  private caseData?: CreatedCaseSummary;
  private bookingData?: BookingDetails;
  private recordingData?: RecordingDetails;

  private createNewCaseApi: CreateNewCaseApi;
  private createBookingApi: CreateBookingApi;
  private createOrUpdateCaptureSessionApi: CreateOrUpdateCaptureSessionApi;
  private createOrUpdateRecordingApi: CreateOrUpdateRecordingApi;
  private getCaseDetailsByCaseReferenceApi: GetCaseDetailsByCaseReferenceApi;
  private getLatestRecordingApi: GetLatestRecordingApi;

  constructor(apiContext: APIRequestContext, userId: string, courtId: string) {
    this.createNewCaseApi = new CreateNewCaseApi(apiContext, courtId);
    this.createBookingApi = new CreateBookingApi(apiContext);
    this.createOrUpdateCaptureSessionApi = new CreateOrUpdateCaptureSessionApi(apiContext, userId);
    this.createOrUpdateRecordingApi = new CreateOrUpdateRecordingApi(apiContext);
    this.getCaseDetailsByCaseReferenceApi = new GetCaseDetailsByCaseReferenceApi(apiContext, courtId);
    this.getLatestRecordingApi = new GetLatestRecordingApi(apiContext);
  }

  /**
   * Creates a new case using the provided number of defendants, and witnesses.
   * Stores the created case data internally and verifies the case has been created.
   * @param numberOfDefendants - Number of defendants for the case.
   * @param numberOfWitnesses - Number of witnesses for the case.
   * @returns The created case summary.
   */
  public async createCase(numberOfDefendants: number, numberOfWitnesses: number): Promise<CreatedCaseSummary> {
    const caseData: CreatedCaseSummary = await this.createNewCaseApi.request(numberOfDefendants, numberOfWitnesses);
    await this.verifyCaseHasBeenCreated(caseData.caseReference);
    this.caseData = caseData;
    return caseData;
  }

  /**
   * Polls the API to verify that a case with the given reference exists.
   * Throws an error if the case is not found within the timeout period.
   * @param caseReference - The reference of the case to verify.
   */
  public async verifyCaseHasBeenCreated(caseReference: string): Promise<void> {
    await expect
      .poll(
        async () => {
          const response = await this.getCaseDetailsByCaseReferenceApi.request(caseReference);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const caseDTOList = (response as any)?._embedded?.caseDTOList;
          return Array.isArray(caseDTOList) && caseDTOList.some((caseDTO) => caseDTO.reference === caseReference);
        },
        {
          timeout: 60000,
          intervals: [2000],
        },
      )
      .toBe(true);
  }

  /**
   * Creates a booking for a new case with the specified details.
   * Stores the booking data internally.
   * @param numberOfDefendants - Number of defendants for the case.
   * @param numberOfWitnesses - Number of witnesses for the case.
   * @param scheduleDate - The date to schedule the booking ('today' or 'tomorrow').
   * @returns The booking details.
   */
  public async createBooking(numberOfDefendants: number, numberOfWitnesses: number, scheduleDate: 'today' | 'tomorrow'): Promise<BookingDetails> {
    const caseData: CreatedCaseSummary = await this.createCase(numberOfDefendants, numberOfWitnesses);
    const bookingId = await this.createBookingApi.request(
      caseData.caseId,
      caseData.participants.defendants[0],
      caseData.participants.witnesses,
      scheduleDate,
    );
    const bookingData: BookingDetails = {
      caseReference: caseData.caseReference,
      defendantNames: caseData.defendantNames,
      witnessNames: caseData.witnessNames,
      bookingId: bookingId,
      defendantSelectedForCase: caseData.defendantNames[0],
    };
    this.bookingData = bookingData;
    return bookingData;
  }

  /**
   * Creates a new case, schedules a booking and assigns a recording.
   * This method creates a case and booking, captures a session, retrieves the latest recording,
   * and updates the capture session with the recording details.
   * @param numberOfDefendants - Number of defendants for the case.
   * @param numberOfWitnesses - Number of witnesses for the case.
   * @return A promise that resolves when the recording is created and assigned.
   */
  public async createANewCaseAndAssignRecording(numberOfDefendants: number, numberOfWitnesses: number): Promise<RecordingDetails> {
    // Create a new case and schedules a recording (Booking)
    const bookingDetails = await this.createBooking(numberOfDefendants, numberOfWitnesses, 'today');
    // Create a capture session for the booking with status 'STANDBY'
    const captureSessionDetails = await this.createOrUpdateCaptureSessionApi.request(bookingDetails.bookingId, 'STANDBY');
    // Retrieve the latest recording created by the test suite
    const recordingDetails = await this.getLatestRecordingApi.request();
    // Update the capture session with the recording details obtained from the latest recording
    await this.createOrUpdateRecordingApi.request(captureSessionDetails.captureSessionId, {
      recordingDuration: recordingDetails.recordingDuration,
      recordingFileName: recordingDetails.recordingFilename,
      recordingId: recordingDetails.recordingId,
    });
    // Complete the capture session with the recording details by setting the status to 'RECORDING_AVAILABLE'
    const captureSessionDetailsUponCompletion = await this.createOrUpdateCaptureSessionApi.request(
      bookingDetails.bookingId,
      'RECORDING_AVAILABLE',
      captureSessionDetails.captureSessionId,
    );

    // Set the recording details with the correct format to be used in test assertions
    const sessionDate = new Date(captureSessionDetailsUponCompletion.sessionDateTime);
    const recordingData: RecordingDetails = {
      recordingId: recordingDetails.recordingId,
      recordingDate: sessionDate.toLocaleDateString('en-GB'),
      recordingTime: sessionDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      recordingDuration: await this.formatDuration(recordingDetails.recordingDuration),
    };
    this.recordingData = recordingData;
    return recordingData;
  }

  /**
   * Formats the recording duration from ISO 8601 format to HH:MM:SS.
   * @param duration - The duration string in ISO 8601 format (e.g., "PT1H30M45S").
   * @returns A promise that resolves to the formatted duration string.
   */
  private async formatDuration(duration: string): Promise<string> {
    const hoursMatch = duration.match(/(\d+)H/);
    const minutesMatch = duration.match(/(\d+)M/);
    const secondsMatch = duration.match(/(\d+(\.\d+)?)S/);

    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
    const seconds = secondsMatch ? Math.floor(parseFloat(secondsMatch[1])) : 0;

    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }

  /**
   * Returns the most recently created case data.
   * Throws an error if no case data is available.
   * @returns The last created case summary.
   */
  public async getCaseData(): Promise<CreatedCaseSummary> {
    if (!this.caseData) {
      throw new Error('No case data available. Please create a case first.');
    }
    return this.caseData;
  }

  /**
   * Returns the most recently created booking data.
   * Throws an error if no booking data is available.
   * @returns The last created booking details.
   */
  public async getBookingData(): Promise<BookingDetails> {
    if (!this.bookingData) {
      throw new Error('No booking data available. Please create a booking first.');
    }
    return this.bookingData;
  }

  /**
   * Returns the most recently created recording data.
   * Throws an error if no recording data is available.
   * @returns The last created recording details.
   */
  public async getRecordingData(): Promise<RecordingDetails> {
    if (!this.recordingData) {
      throw new Error('No recording data available. Please create a recording first.');
    }
    return this.recordingData;
  }
}
