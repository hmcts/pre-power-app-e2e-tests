import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../../base';
import { BaseCaseDetails } from '../../../../types';

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
    validationErrorCloseButton: this.iFrame.getByRole('button', { name: 'Close' }),
    exsitingCaseFoundButtonInSearchList: this.iFrame
      .locator('[data-control-name="bookingScrn_ExistingCasesGallery_Gal"]')
      .locator('[data-control-part="gallery-item"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.iFrame.getByRole('heading', { name: 'Case Details' }),
    saveCaseSuccessLogo: this.iFrame.locator('[data-control-name*="SaveConfirmationCheck"]'),
    saveCaseSuccessText: this.iFrame.getByText('Case Opened', { exact: true }),
    validationErrorHeading: this.iFrame.locator("div[appmagic-control*='errorLabel']"),
    validationErrorText: this.iFrame.locator('[data-control-name="ErrorMessage"]'),
    searchResultExistingCasesTitle: this.iFrame.locator('[data-control-name="bookingScrn_ExistingCasesTitle_Txt"]'),
    selectedExistingCaseReferenceLable: this.iFrame.locator('[data-control-name="bookingScrn_SelectedReference_Lbl"]'),
    selectedExisitingCaseSourceLable: this.iFrame.locator('[data-control-name="bookingScrn_ClosureStatusLabel_Lbl_2"]'),
    selectedExisitingCaseStatusLable: this.iFrame.locator('[data-control-name="bookingScrn_ClosureStatus_Lbl"]'),
    selectedExisitingCaseDefendantNames: this.iFrame.locator('[data-control-name="bookingScrn_DefendantsHintText_lbl"]'),
    selectedExisitingCaseWitnessNames: this.iFrame.locator('[data-control-name="bookingScrn_WitnessesHintText_lbl"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnCaseDetailsPage(): Promise<void> {
    await expect(this.$static.pageHeading).toBeVisible();
  }

  /**
   * Populates the case details form with the provided details.
   * @param details - An object containing case reference, defendants, and witnesses.
   */
  public async populateCaseDetails(details: BaseCaseDetails): Promise<void> {
    await this.$inputs.caseReference.fill(details.caseReference);
    await this.$inputs.defendants.fill(details.defendantNames.join(', '));
    await this.$inputs.witnesses.fill(details.witnessNames.join(', '));
  }

  /**
   * Searches for an existing case by its reference and selects it.
   * @param caseReference - Reference of the case to search for.
   * Verifies the case reference provided has been selected.
   */
  public async searchAndSelectExistingCase(caseReference: string): Promise<void> {
    const locator = this.iFrame.getByRole('button', { name: `Case reference ${caseReference}` });

    await this.$inputs.caseReference.fill(caseReference);
    await expect(locator).toBeVisible();
    await locator.click();
    await expect(this.iFrame.locator('[data-control-name*="SelectedReference_Lbl"]').filter({ hasText: caseReference })).toBeVisible();
  }
}
