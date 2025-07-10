import { expect, request } from '@playwright/test';
import { DataUtils } from '../../utils';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../utils';
import { CreatedCaseSummary } from '../../types';

export class CreateNewCaseApi {
  private dataUtils = new DataUtils();

  /**
   * Creates a new case via Power App API.
   *
   * @param userId - The ID of the user creating the case.
   * @param courtId - The ID of the court where the case is being created.
   * @param numberOfDefendants - The number of defendants in the case.
   * @param numberOfWitnesses - The number of witnesses in the case.
   * @returns A promise that resolves to a CreatedCaseSummary object containing details of the created case.
   */
  public async request(userId: string, courtId: string, numberOfDefendants: number, numberOfWitnesses: number): Promise<CreatedCaseSummary> {
    const caseDetails = this.dataUtils.generateRandomCaseDetails(numberOfDefendants, numberOfWitnesses);
    const requestId = uuidv4();

    const apiContext = await request.newContext();

    const witnessParticipants = caseDetails.witnessNames.map((nameOfWitness) => ({
      first_name: nameOfWitness,
      last_name: '',
      id: uuidv4(),
      participant_type: 'WITNESS',
    }));

    const defendantParticipants = caseDetails.defendantNames.map((nameOfDefendant) => {
      const [first_name, ...lastNameParts] = nameOfDefendant.split(' ');
      return {
        first_name,
        last_name: lastNameParts.join(' '),
        id: uuidv4(),
        participant_type: 'DEFENDANT',
      };
    });

    const participants = [...witnessParticipants, ...defendantParticipants];
    const dateTimeNow = new Date().toISOString();

    const requestBody = {
      closed_at: null,
      court_id: courtId,
      id: requestId,
      origin: 'PRE',
      participants,
      reference: caseDetails.caseReference,
      state: 'OPEN',
      test: false,
      created_at: dateTimeNow,
      modified_at: dateTimeNow,
    };

    const response = await apiContext.put(config.urls.powerAppApiUrl + '/cases/' + requestId, {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      data: requestBody,
    });

    await expect(response).toBeOK();

    return {
      caseReference: caseDetails.caseReference,
      caseId: requestId,
      created_at: requestBody.created_at,
      modified_at: requestBody.modified_at,
      defendantNames: caseDetails.defendantNames,
      witnessNames: caseDetails.witnessNames,
      participants: {
        defendants: defendantParticipants,
        witnesses: witnessParticipants,
      },
    };
  }
}
