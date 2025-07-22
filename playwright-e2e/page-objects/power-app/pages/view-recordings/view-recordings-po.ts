import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../../base';
import { NavBarComponent } from '../../components';

export class ViewRecordingsPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  private navBar = new NavBarComponent(this.page);

  public readonly $inputs = {
    caseReference: this.iFrame.getByPlaceholder('Case Reference'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    refreshResultsButton: this.iFrame.getByRole('button', { name: 'Refresh Data' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    caseReferenceLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryReference_Lbl"]'),
    recordingVersionLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryVersion_Lbl"]'),
    courtLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryCourt_Lbl"]'),
    recordingIdLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryID_Lbl"]'),
    WitnessLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryWitness_Lbl"]'),
    defendantLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryDefendants_Lbl"]'),
    recordingDateLabelInSearchList: this.iFrame.locator('[data-control-name$="RecordingsGalleryDate_Lbl"]'),
    recordingSourceLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryDate_Lbl_3"]'),
    recordingDurationLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryDuration_Lbl"]'),
    StatusLabelInSearchList: this.iFrame.locator('[data-control-name*="RecordingsGalleryDate_Lbl_1"]'),
    caseStatusLabelInSearchList: this.iFrame.locator('[data-control-name="Label1"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnViewRecordingsPage(): Promise<void> {
    await expect(this.navBar.$interactive.ViewRecordings).toBeVisible();
  }

  public async searchForCaseReference(caseReference: string): Promise<void> {
    await this.$inputs.caseReference.fill(caseReference);
    await expect(this.$inputs.caseReference).toHaveValue(caseReference);

    await expect(async () => {
      await this.refreshResultsIfMoreThenOneCaseReference();
      await expect(this.$static.caseReferenceLabelInSearchList).toContainText(caseReference, { timeout: 2000 });
    }).toPass({ intervals: [2500], timeout: 10000 });
  }

  public async refreshResultsIfMoreThenOneCaseReference(): Promise<void> {
    const caseReferenceList = this.iFrame.locator('[data-control-name*="viewRecordingsScrn_RecordingsGallery_Gal"]').locator('[role="listitem"]');

    if ((await caseReferenceList.count()) > 1) {
      await this.$interactive.refreshResultsButton.click();
      await expect(caseReferenceList).toHaveCount(1);
    }
  }
}
