import { BookingDetails, CreatedCaseSummary } from '../types';
import * as apiRequests from './index';
const createNewCaseApi = new apiRequests.CreateNewCaseApi();
const createBookingApi = new apiRequests.CreateBookingApi();

export interface ApiFixtures {
  createNewCaseApi: apiRequests.CreateNewCaseApi;
  createBookingForNewCaseViaApi: typeof createBooking;
}

export const apiFixtures = {
  createNewCaseApi: async ({}, use) => {
    await use(createNewCaseApi);
  },
  createBookingForNewCaseViaApi: async ({}, use) => {
    await use(createBooking);
  },
};

/**
 *
 * @param userId  The user ID of the person creating the booking
 * @param courtId  The court ID where the booking is being made
 * @param numberOfDefendants The number of defendants in the case
 * @param numberOfWitnesses  The number of witnesses in the case
 * @param scheduleDate The date to schedule the booking, either 'today' or 'tomorrow'
 * @returns An object containing the case reference, defendant name, and witness names
 */
const createBooking = async (
  userId: string,
  courtId: string,
  numberOfDefendants: number,
  numberOfWitnesses: number,
  scheduleDate: 'today' | 'tomorrow',
): Promise<BookingDetails> => {
  const caseData: CreatedCaseSummary = await createNewCaseApi.request(userId, courtId, numberOfDefendants, numberOfWitnesses);
  await createBookingApi.request(userId, caseData.caseId, caseData.participants.defendants[0], caseData.participants.witnesses, scheduleDate);
  return {
    caseReference: caseData.caseReference,
    defendantNames: caseData.defendantNames,
    witnessNames: caseData.witnessNames,
    defendantSelectedForCase: caseData.defendantNames[0],
  };
};
