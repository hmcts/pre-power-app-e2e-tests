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
    manageButton: this.iFrame.locator('[data-control-name="manageBookingScrn_Manage_Btn"]'),
    amendButton: this.iFrame.locator('[data-control-name="manageBookingScrn_Amend_Btn"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.iFrame.locator('[data-control-name="manageBookingScrn_BookedSrchRef_Lbl"]').filter({ hasText: 'Case Reference' }),
    searchResultGallery: this.iFrame.locator('[data-control-name="manageBookingScrn_Recordings_Gal"]'),
    listItemsInSearchResultsGallery: this.iFrame.locator('[data-control-name="manageBookingScrn_Recordings_Gal"]').locator('[role="listitem"]'),
    caseReferenceLabelInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_CaseRef_Lbl"]'),
    witnessLabelInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_Witness_Lbl"]'),
    defendantLabelInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_Defendants_Lbl"]'),
    scheduledDateLabelInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_RecDate_Lbl"]'),
    caseActionsStatusLabelInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_Status_Lbl"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $manageCaseModal = {
    modalWindow: this.iFrame.locator('[data-control-name="AdmMngCasesBackgroundIcn_6"]'),
    cancelButton: this.iFrame.locator('[data-control-name="EditReqDetailsBtn_3"]'),
    shareButton: this.iFrame.locator('[data-control-name="MngRecShareAccessBtn_3"]'),
    auditButton: this.iFrame.locator('[data-control-name="MngRecShareAccessBtn_5"]'),
    auditCaseInformationText: this.iFrame.locator('[data-control-name="RepInfo-Manage_2"]'),
    auditReportDateLabel: this.iFrame.locator('[data-control-name="RepDte-Manage_2"]'),
    closeAuditButton: this.iFrame.locator('[data-control-name="AudClose-Manage_2"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $amendCaseModal = {
    modalWindow: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingWindow_Shp_1"]'),
    caseReferenceText: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingCaseReference_Txt_1"]'),
    witnessDropdown: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingWitness_Cmb_1"]'),
    defendantsDropdown: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingDefendant_Cmb_1"]'),
    dateDropdown: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingDate_Dte_1"]'),
    cancelButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingCancel_Btn_1"]'),
    yesToCancelButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendCancelConfirm_Btn_1"]'),
    noToCancelButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendCancelCancel_Btn_1"]'),
    deleteButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingDelete_Btn_1"]'),
    deleteCaseText: this.iFrame.locator('[data-control-name="manageBookingsScrn_DeleteScheduleBody_Lbl_2"]'),
    yesToDeleteButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_DeleteScheduleDelete_Btn_2"]'),
    noToDeleteButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_DeleteScheduleCancel_Btn_2"]'),
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
    if ((await this.$static.listItemsInSearchResultsGallery.count()) > 1) {
      await this.$interactive.refreshResultsButton.click();
      await expect(this.$static.listItemsInSearchResultsGallery).toHaveCount(1);
    }
  }
}
