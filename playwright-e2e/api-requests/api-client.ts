import { expect } from '@playwright/test';
import { BookingDetails, CreatedCaseSummary } from '../types';
import * as apiRequests from './index';

export class ApiClient {
  private caseData?: CreatedCaseSummary;
  private bookingData?: BookingDetails;

  private createNewCaseApi = new apiRequests.CreateNewCaseApi();
  private createBookingApi = new apiRequests.CreateBookingApi();
  private getCaseDeatilsByCaseReferenceApi = new apiRequests.GetCaseDeatilsByCaseReferenceApi();

  public async createCase(userId: string, courtId: string, numberOfDefendants: number, numberOfWitnesses: number): Promise<CreatedCaseSummary> {
    const caseData: CreatedCaseSummary = await this.createNewCaseApi.request(userId, courtId, numberOfDefendants, numberOfWitnesses);
    await this.verifyCaseHasBeenCreated(userId, courtId, caseData.caseReference);
    this.caseData = caseData;
    return caseData;
  }

  public async verifyCaseHasBeenCreated(userId: string, courtId: string, caseReference: string): Promise<void> {
    await expect
      .poll(
        async () => {
          const response = await this.getCaseDeatilsByCaseReferenceApi.request(userId, courtId, caseReference);
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

  public async getCaseData(): Promise<CreatedCaseSummary> {
    if (!this.caseData) {
      throw new Error('No case data available. Please create a case first.');
    }
    return this.caseData;
  }

  public async getBookingData(): Promise<BookingDetails> {
    if (!this.bookingData) {
      throw new Error('No booking data available. Please create a booking first.');
    }
    return this.bookingData;
  }
}
