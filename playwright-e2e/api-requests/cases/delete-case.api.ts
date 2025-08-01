import { APIRequestContext, expect } from '@playwright/test';

export class DeleteCaseApi {
  private apiContext: APIRequestContext;

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext;
  }

  public async request(caseId: string): Promise<void> {
    const response = await this.apiContext.delete('/cases/' + caseId);

    await expect(response).toBeOK();
  }
}
