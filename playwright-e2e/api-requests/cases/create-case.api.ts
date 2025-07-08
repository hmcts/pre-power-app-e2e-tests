import { request } from '@playwright/test';
import { DataUtils } from '../../utils';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../utils';
import { CaseDetailsType } from '../../page-objects/pages';

export class CreateNewCaseApi {
  private dataUtils = new DataUtils();

  /**
   * Creates a new case via Power App API.
   *
   * @param userId - The ID of the user creating the case.
   * @param courtId - The ID of the court where the case is being created.
   * @param numberOfDefendants - The number of defendants in the case.
   * @param numberOfWitnesses - The number of witnesses in the case.
   * @returns A promise that resolves to a CreatedCaseSummary containing the case reference and participants.
   */
  public async request(userId: string, courtId: string, numberOfDefendants: number, numberOfWitnesses: number): Promise<CaseDetailsType> {
    const caseDetails = this.dataUtils.generateRandomCaseDetails(numberOfDefendants, numberOfWitnesses);
    const requestId = uuidv4();

    const apiContext = await request.newContext();

    const participants = [
      ...caseDetails.witnesses.map((witness) => ({
        first_name: witness,
        id: uuidv4(),
        last_name: '',
        participant_type: 'WITNESS',
      })),
      ...caseDetails.defendants.map((defendant) => ({
        first_name: defendant.split(' ')[0],
        last_name: defendant.split(' ').slice(1).join(' '),
        id: uuidv4(),
        participant_type: 'DEFENDANT',
      })),
    ];
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

    if (!response.ok()) {
      throw new Error(`Failed to create new case: ${response.status()} ${response.statusText()}`);
    }

    return {
      caseReference: caseDetails.caseReference,
      defendants: caseDetails.defendants,
      witnesses: caseDetails.witnesses,
    };
  }
}
