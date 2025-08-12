import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../../base';

export class ManageBookingsPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    caseReference: this.iFrame.getByRole('textbox', { name: 'Search Case Reference' }),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    refreshResultsButton: this.iFrame.getByRole('button', { name: 'Refresh Data' }),
    recordButton: this.iFrame.getByRole('button', { name: 'Record' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.iFrame.locator('[data-control-name="manageBookingScrn_BookedSrchRef_Lbl"]').filter({ hasText: 'Case Reference' }),
    listOfAllCaseReferencesInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_Recordings_Gal"]').locator('[role="listitem"]'),
    caseReferenceLabelInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_CaseRef_Lbl"]'),
    caseActionsStatusLabelInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_Status_Lbl"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnManageBookingsPage(): Promise<void> {
    await expect(this.$static.pageHeading).toBeVisible();
  }

  /**
   * Searches for a booking using the provided case reference.
   * Fills the search input and verifies that the booking with the given reference is visible on the page.
   * @param caseReference - The case reference to search for.
   */
  public async searchForABooking(caseReference: string): Promise<void> {
    await this.$inputs.caseReference.fill(caseReference);
    await expect(this.$inputs.caseReference).toHaveValue(caseReference);

    await expect(async () => {
      await this.refreshResultsIfMoreThenOneCaseReference();
      await expect(this.$static.caseReferenceLabelInSearchList).toHaveText(caseReference);
    }).toPass({ intervals: [2500], timeout: 10000 });
  }

  public async refreshResultsIfMoreThenOneCaseReference(): Promise<void> {
    if ((await this.$static.listOfAllCaseReferencesInSearchList.count()) > 1) {
      await this.$interactive.refreshResultsButton.click();
      await expect(this.$static.listOfAllCaseReferencesInSearchList).toHaveCount(1);
    }
  }
}
