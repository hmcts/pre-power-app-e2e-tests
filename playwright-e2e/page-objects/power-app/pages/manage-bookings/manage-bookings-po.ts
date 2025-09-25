import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../../base';
import { th } from '@faker-js/faker/.';
import { getShortDateWithAbbreviatedDayMonth } from '../../../utils/data.utils';


export class ManageBookingsPage extends Base {
  static searchForABookingByDate: any;
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    caseReference: this.iFrame.getByRole('textbox', { name: 'Search Case Reference' }),
    searchForABookingByDate: this.iFrame.getByRole('button', { name: 'Select Scheduled Date' }),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    refreshResultsButton: this.iFrame.getByRole('button', { name: 'Refresh Data' }),
    manageButton: this.iFrame.locator('[data-control-name="manageBookingScrn_Manage_Btn"] button'),
    amendButton: this.iFrame.locator('[data-control-name="manageBookingScrn_Amend_Btn"] button'),
    recordButton: this.iFrame.locator('[data-control-name="manageBookingScrn_Record_Btn"] button'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.iFrame.locator('[data-control-name="manageBookingScrn_BookedSrchRef_Lbl"]').filter({ hasText: 'Case Reference' }),
    searchResultGallery: this.iFrame.locator('[data-control-name="manageBookingScrn_Recordings_Gal"]'),
    okButton: this.iFrame.getByRole('button', { name: 'OK' }),
    searchForABookingByDate: this.iFrame.getByRole('button', { name: 'Select Scheduled Date' }),
    listItemsInSearchResultsGallery: this.iFrame.locator('[data-control-name="manageBookingScrn_Recordings_Gal"]').locator('[role="listitem"]'),
    searchResultExistingCasesTitle: this.iFrame
      .locator('[data-control-name="manageBookingScrn_ExistingCases_Lbl"]')
      .filter({ hasText: 'Existing Cases' }),
    selectedExistingCaseReferenceLabel: this.iFrame.locator('[data-control-name="manageBookingScrn_SelectedCaseRef_Lbl"]'),
    caseReferenceLabelInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_CaseRef_Lbl"]'),
    witnessLabelInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_Witness_Lbl"]'),
    defendantLabelInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_Defendants_Lbl"]'),
    scheduledDateLabelInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_RecDate_Lbl"]'),
    caseActionsStatusLabelInSearchList: this.iFrame.locator('[data-control-name="manageBookingScrn_Status_Lbl"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $manageCaseModal = {
    modalWindow: this.iFrame.locator('[data-control-name="AdmMngCasesBackgroundIcn_6"]'),
    cancelButton: this.iFrame.locator('[data-control-name="EditReqDetailsBtn_3"] button'),
    shareButton: this.iFrame.locator('[data-control-name="MngRecShareAccessBtn_3"] button'),
    shareWithUsersTitle: this.iFrame.locator('[data-control-name="ShareComboboxLabelInput"] input'),
    shareDropdown: this.iFrame.locator('[data-control-name="MngNewAcsGrpCbx_3"]'),
    auditButton: this.iFrame.locator('[data-control-name="MngRecShareAccessBtn_5"] button'),
    auditCaseInformationText: this.iFrame.locator('[data-control-name="RepInfo-Manage_2"]'),
    auditReportDateLabel: this.iFrame.locator('[data-control-name="RepDte-Manage_2"]'),
    closeAuditButton: this.iFrame.locator('[data-control-name="AudClose-Manage_2"] button'),
    grantAccessButton: this.iFrame.locator('[data-control-name="MngNewAcsGrpClearBtn_3"] button'),
  } as const satisfies Record<string, Locator>;

  public readonly $amendCaseModal = {
    modalWindow: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingWindow_Shp_1"]'),
    caseReferenceText: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingCaseReference_Txt_1"]'),
    witnessDropdown: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingWitness_Cmb_1"]'),
    defendantsDropdown: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingDefendant_Cmb_1"]'),
    dateDropdown: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingDate_Dte_1"]'),
    cancelButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingCancel_Btn_1"] button'),
    yesToCancelButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendCancelConfirm_Btn_1"] button'),
    noToCancelButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendCancelCancel_Btn_1"] button'),
    deleteButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingDelete_Btn_1"] button'),
    deleteCaseText: this.iFrame.locator('[data-control-name="manageBookingsScrn_DeleteScheduleBody_Lbl_2"]'),
    yesToDeleteButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_DeleteScheduleDelete_Btn_2"] button'),
    noToDeleteButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_DeleteScheduleCancel_Btn_2"] button'),
    saveButton: this.iFrame.locator('[data-control-name="manageBookingsScrn_AmendBookingSave_Btn_1"] button'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnManageBookingsPage(): Promise<void> {
    await expect(this.$static.pageHeading).toBeVisible({ timeout: 15000 });
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

  /**
   * Searches for a booking using the today's date.
   * Fills the search input and verifies that the booking with the given date is visible on the page.
   * @param searchForABookingByDate - The date to search for.
   */

  public async searchForABookingByDate(searchForABookingByDate: string): Promise<void> {
    // if (!searchForABookingByDate) throw new Error('Date is required for searchForABookingByDate');
    await expect(this.$static.searchForABookingByDate).toBeVisible({ timeout: 30000 }); // Wait for input
    await this.$static.searchForABookingByDate.click();

    const scheduledDate = getShortDateWithAbbreviatedDayMonth();
    await this.iFrame.getByRole('button', { name: scheduledDate }).click();
    
    await this.iFrame.getByRole('button', { name: /Thu Sep 25 2025/i }).click();
    await this.$static.okButton.last().click();

    expect(async () => {
      await this.refreshResultsIfMoreThenOneSearchForAbookibgByDate();
      await expect(this.$static.scheduledDateLabelInSearchList).toHaveText(searchForABookingByDate);
      await expect(this.$static.searchResultExistingCasesTitle).toBeVisible();
    });
  }
  public async refreshResultsIfMoreThenOneSearchForAbookibgByDate(): Promise<void> {
    if ((await this.$static.listItemsInSearchResultsGallery.count()) > 1) {
      await this.$interactive.refreshResultsButton.click();
      await expect(this.$static.listItemsInSearchResultsGallery).toHaveCount(25); // Date search returns 24 items
    }
  }

  public async refreshResultsIfMoreThenOneCaseReference(): Promise<void> {
    if ((await this.$static.listItemsInSearchResultsGallery.count()) > 1) {
      await this.$interactive.refreshResultsButton.click();
      await expect(this.$static.listItemsInSearchResultsGallery).toHaveCount(1);
    }
  }
}
