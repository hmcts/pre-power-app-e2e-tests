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
    const foundCaseReflocator = this.iFrame.locator('[data-control-name="manageBookingScrn_CaseRef_Lbl"]').filter({ hasText: caseReference });

    await this.$inputs.caseReference.fill(caseReference);
    await expect(this.$inputs.caseReference).toHaveValue(caseReference);

    try {
      await expect(foundCaseReflocator).toBeVisible({ timeout: 3000 });
    } catch {
      await this.$interactive.refreshResultsButton.click();
      await expect(foundCaseReflocator).toBeVisible({ timeout: 5000 });
    }
  }
}
