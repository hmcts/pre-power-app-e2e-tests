import { expect } from '@playwright/test';
import { BookingDetails, CreatedCaseSummary } from '../types';
import { CreateNewCaseApi, CreateBookingApi, GetCaseDetailsByCaseReferenceApi } from './index.js';

export class ApiClient {
  private caseData?: CreatedCaseSummary;
  private bookingData?: BookingDetails;

  private createNewCaseApi = new CreateNewCaseApi();
  private createBookingApi = new CreateBookingApi();
  private getCaseDetailsByCaseReferenceApi = new GetCaseDetailsByCaseReferenceApi();

  /**
   * Creates a new case using the provided user and court IDs, number of defendants, and witnesses.
   * Stores the created case data internally and verifies the case has been created.
   * @param userId - The ID of the user creating the case.
   * @param courtId - The ID of the court for the case.
   * @param numberOfDefendants - Number of defendants for the case.
   * @param numberOfWitnesses - Number of witnesses for the case.
   * @returns The created case summary.
   */
  public async createCase(userId: string, courtId: string, numberOfDefendants: number, numberOfWitnesses: number): Promise<CreatedCaseSummary> {
    const caseData: CreatedCaseSummary = await this.createNewCaseApi.request(userId, courtId, numberOfDefendants, numberOfWitnesses);
    await this.verifyCaseHasBeenCreated(userId, courtId, caseData.caseReference);
    this.caseData = caseData;
    return caseData;
  }

  /**
   * Polls the API to verify that a case with the given reference exists for the specified user and court.
   * Throws an error if the case is not found within the timeout period.
   * @param userId - The ID of the user.
   * @param courtId - The ID of the court.
   * @param caseReference - The reference of the case to verify.
   */
  public async verifyCaseHasBeenCreated(userId: string, courtId: string, caseReference: string): Promise<void> {
    await expect
      .poll(
        async () => {
          const response = await this.getCaseDetailsByCaseReferenceApi.request(userId, courtId, caseReference);
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
   * @param userId - The ID of the user creating the booking.
   * @param courtId - The ID of the court for the booking.
   * @param numberOfDefendants - Number of defendants for the case.
   * @param numberOfWitnesses - Number of witnesses for the case.
   * @param scheduleDate - The date to schedule the booking ('today' or 'tomorrow').
   * @returns The booking details.
   */
  public async createBooking(
    userId: string,
    courtId: string,
    numberOfDefendants: number,
    numberOfWitnesses: number,
    scheduleDate: 'today' | 'tomorrow',
  ): Promise<BookingDetails> {
    const caseData: CreatedCaseSummary = await this.createCase(userId, courtId, numberOfDefendants, numberOfWitnesses);
    await this.createBookingApi.request(userId, caseData.caseId, caseData.participants.defendants[0], caseData.participants.witnesses, scheduleDate);
    const bookingData: BookingDetails = {
      caseReference: caseData.caseReference,
      defendantNames: caseData.defendantNames,
      witnessNames: caseData.witnessNames,
      defendantSelectedForCase: caseData.defendantNames[0],
    };
    this.bookingData = bookingData;
    return bookingData;
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
}
