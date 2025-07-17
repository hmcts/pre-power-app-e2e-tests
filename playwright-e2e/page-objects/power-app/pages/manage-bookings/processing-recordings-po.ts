import { Page, expect } from '@playwright/test';
import { Base } from '../../base';
import { NavBarComponent } from '../../components';

export class ProcessingRecordingsPage extends Base {
  private navBar = new NavBarComponent(this.page);
  constructor(page: Page) {
    super(page);
  }

  public async verifyUserIsOnProcessingRecordingsPage(): Promise<void> {
    await expect(this.navBar.$interactive.ProcessingRecordings).toBeVisible();
  }

  /**
   * Verifies that a recording for the given case reference is being processed.
   * Checks that the case reference is visible in the list and that its status is "PROCESSING".
   * @param caseReference - The case reference to check for processing status.
   */
  public async verifyRecordingIsBeingProcessed(caseReference: string): Promise<void> {
    await expect(this.iFrame.getByText(caseReference, { exact: true })).toBeVisible({ timeout: 30000 });
    await expect(this.iFrame.getByText('PROCESSING', { exact: true })).toBeVisible();
  }
}
