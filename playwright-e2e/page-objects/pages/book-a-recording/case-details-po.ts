import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../../base';

export type CaseDetailsType = {
  caseReference: string;
  defendants: string[];
  witnesses: string[];
};

export class CaseDetailsPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    caseReference: this.iFrame.getByRole('textbox', { name: 'Enter Case' }),
    defendants: this.iFrame.getByRole('textbox', { name: 'Enter your Defendants' }),
    witnesses: this.iFrame.getByRole('textbox', { name: 'Enter your Witnesses' }),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    modifyButton: this.iFrame.getByRole('button', { name: 'Modify' }),
    saveButton: this.iFrame.getByRole('button', { name: 'Save' }),
    bookingsButton: this.iFrame.getByRole('button', { name: 'Bookings' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.iFrame.getByRole('heading', { name: 'Case Details' }),
    saveCaseSuccessLogo: this.iFrame.locator('[data-control-name*="SaveConfirmationCheck"]'),
    saveCaseSuccessText: this.iFrame.getByText('Case Opened', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnCaseDetailsPage(): Promise<void> {
    await expect(this.$static.pageHeading).toBeVisible();
  }

  /**
   * Populates the case details form with the provided details.
   * @param details - An object containing case reference, defendants, and witnesses.
   */
  public async populateCaseDetails(details: CaseDetailsType): Promise<void> {
    await this.$inputs.caseReference.fill(details.caseReference);
    await this.$inputs.defendants.fill(details.defendants.join(', '));
    await this.$inputs.witnesses.fill(details.witnesses.join(', '));
  }
}
