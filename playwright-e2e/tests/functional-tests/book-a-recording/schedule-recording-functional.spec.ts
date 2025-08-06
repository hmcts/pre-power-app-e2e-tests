import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';

test.describe('Set of tests to verify functionality of schedule a recording page for Level 1 user', () => {
  const user = config.powerAppUsers.preLevel1User;
  test.use({ storageState: user.sessionFile });

  test(
    'Verify user is able to book a recording for an existing case',
    {
      tag: '@regression',
    },
    async ({ scheduleRecordingPage, apiClient, navigateToScheduleRecordingsPage }) => {
      await test.step('Pre-requisite step in order to create a case via api and navigate to schedule recordings page', async () => {
        const caseData = await apiClient.createCase(2, 2);
        await navigateToScheduleRecordingsPage(caseData.caseReference);
      });

      const caseData = await apiClient.getCaseData();
      let dateSelected: string;

      await test.step('Verify user is able to schedule a recording', async () => {
        dateSelected = await scheduleRecordingPage.selectDateFromToday();
        await scheduleRecordingPage.selectWitnessFromDropDown(caseData.witnessNames[0]);
        await scheduleRecordingPage.selectAllDefendantsFromDropDown();
        await scheduleRecordingPage.$interactive.saveButton.click();
        await expect(scheduleRecordingPage.$static.saveCaseSuccessLogo).toBeVisible();
        await expect(scheduleRecordingPage.$static.saveCaseSuccessText).toBeVisible();
      });

      await test.step('Verify correct details for case have been saved', async () => {
        await expect(scheduleRecordingPage.iFrame.getByText(`Recording Start: ${dateSelected}`)).toBeVisible();
        await expect(scheduleRecordingPage.iFrame.getByText(`Witness Name: ${caseData.witnessNames[0]}`)).toBeVisible();
        for (const defendant of caseData.defendantNames) {
          await expect(scheduleRecordingPage.iFrame.getByText('Defendants: ')).toContainText(defendant);
        }
      });
    },
  );

  test(
    'Verify user is able to delete a booking that has been scheduled',
    {
      tag: '@regression',
    },
    async ({ scheduleRecordingPage, apiClient, navBarComponent, homePage, manageBookingsPage, navigateToScheduleRecordingsPage }) => {
      await test.step('Pre-requisite step in order to create a booking via api and navigate to schedule recordings page', async () => {
        const caseData = await apiClient.createBooking(2, 2, 'today');
        await navigateToScheduleRecordingsPage(caseData.caseReference);
      });

      await test.step('Verify recording scheduled is visisble', async () => {
        await scheduleRecordingPage.verifyAllScheduledRecordingsAreVisible(1);
      });

      await test.step('Verify user is able to delete scheduled recording', async () => {
        await scheduleRecordingPage.$interactive.deleteScheduledRecordingButton.click();
        await expect(scheduleRecordingPage.$deleteScheduleModal.modalWindow).toBeVisible();
        await scheduleRecordingPage.$deleteScheduleModal.yesButton.click();

        await expect(
          scheduleRecordingPage.iFrame.locator('[data-control-name="bookingScrn_BookingsGallery_Gal"] [role="listitem"]'),
        ).not.toBeAttached();
      });

      await test.step('Navigate to manage bookings page', async () => {
        await navBarComponent.$interactive.HomeButton.click();
        await homePage.verifyUserIsOnHomePage();
        await homePage.$interactive.manageBookingsButton.click();
        await manageBookingsPage.verifyUserIsOnManageBookingsPage();
      });

      await test.step('Verify user is unable to find deleted scheduled recording within manage bookings page', async () => {
        const caseData = await apiClient.getCaseData();
        await manageBookingsPage.$inputs.caseReference.fill(caseData.caseReference);
        await expect(manageBookingsPage.$inputs.caseReference).toHaveValue(caseData.caseReference);

        await expect(async () => {
          await manageBookingsPage.refreshResultsIfMoreThenOneCaseReference();
          await expect(manageBookingsPage.$static.caseReferenceLabelInSearchList).not.toBeAttached();
        }).toPass({ intervals: [3000], timeout: 12000 });
      });
    },
  );

  test(
    'Verify user is unable to delete a scheduled booking that has a recording',
    {
      tag: '@regression',
    },
    async ({ scheduleRecordingPage, apiClient, navigateToScheduleRecordingsPage }) => {
      await test.step('Pre-requisite step in order to create a case / assign a recording via api and navigate to schedule recordings page', async () => {
        await apiClient.createANewCaseAndAssignRecording(2, 2);
        const caseData = await apiClient.getCaseData();
        await navigateToScheduleRecordingsPage(caseData.caseReference);
      });

      await test.step('Verify recording scheduled is visisble', async () => {
        await scheduleRecordingPage.verifyAllScheduledRecordingsAreVisible(1);
      });

      await test.step('Verify delete button is disabled', async () => {
        await expect(scheduleRecordingPage.$interactive.deleteScheduledRecordingButton).toBeDisabled();
      });
    },
  );
});
