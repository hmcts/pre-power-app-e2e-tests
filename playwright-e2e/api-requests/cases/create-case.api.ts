import { APIRequestContext, expect } from '@playwright/test';
import { DataUtils } from '../../utils';
import { v4 as uuidv4 } from 'uuid';
import { CreatedCaseSummary } from '../../types';

export class CreateNewCaseApi {
  private apiContext: APIRequestContext;
  private courtId: string;
  private dataUtils = new DataUtils();

  constructor(apiContext: APIRequestContext, courtId: string) {
    this.apiContext = apiContext;
    this.courtId = courtId;
  }

  /**
   * Creates a new case with the specified number of defendants and witnesses.
   * @param numberOfDefendants - The number of defendants in the case.
   * @param numberOfWitnesses - The number of witnesses in the case.
   * @returns A promise that resolves to the created case summary.
   */
  public async request(numberOfDefendants: number, numberOfWitnesses: number): Promise<CreatedCaseSummary> {
    const caseDetails = this.dataUtils.generateRandomCaseDetails(numberOfDefendants, numberOfWitnesses);
    const caseId = uuidv4();

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
      court_id: this.courtId,
      id: caseId,
      origin: 'PRE',
      participants,
      reference: caseDetails.caseReference,
      state: 'OPEN',
      test: false,
      created_at: dateTimeNow,
      modified_at: dateTimeNow,
    };

    const response = await this.apiContext.put('/cases/' + caseId, {
      data: requestBody,
    });

    await expect(response).toBeOK();

    return {
      caseReference: caseDetails.caseReference,
      caseId: caseId,
      defendantNames: caseDetails.defendantNames,
      witnessNames: caseDetails.witnessNames,
      participants: {
        defendants: defendantParticipants,
        witnesses: witnessParticipants,
      },
    };
  }
}
