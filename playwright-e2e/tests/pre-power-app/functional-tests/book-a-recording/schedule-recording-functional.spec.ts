import { test, expect } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify functionality of schedule a recording page for Level 1 user', () => {
  const user = config.powerAppUsers.preLevel1User;
  test.use({ storageState: user.sessionFile });

  test(
    'Verify user is able to book a recording for an existing case',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ powerApp_ScheduleRecordingPage, apiClient, navigateToPowerAppScheduleRecordingsPage }) => {
      await test.step('Pre-requisite step in order to create a case via api and navigate to schedule recordings page', async () => {
        const caseData = await apiClient.createCase(2, 2);
        await navigateToPowerAppScheduleRecordingsPage(caseData.caseReference);
      });

      const caseData = await apiClient.getCaseData();
      let dateSelected: string;

      await test.step('Verify user is able to schedule a recording', async () => {
        dateSelected = await powerApp_ScheduleRecordingPage.selectDateFromToday();
        await powerApp_ScheduleRecordingPage.selectWitnessFromDropDown(caseData.witnessNames[0]);
        await powerApp_ScheduleRecordingPage.selectAllDefendantsFromDropDown();
        await powerApp_ScheduleRecordingPage.$interactive.saveButton.click();
        await expect(powerApp_ScheduleRecordingPage.$static.saveCaseSuccessLogo).toBeVisible();
        await expect(powerApp_ScheduleRecordingPage.$static.saveCaseSuccessText).toBeVisible();
      });

      await test.step('Verify correct details for case have been saved', async () => {
        await expect(powerApp_ScheduleRecordingPage.iFrame.getByText(`Recording Start: ${dateSelected}`)).toBeVisible();
        await expect(powerApp_ScheduleRecordingPage.iFrame.getByText(`Witness Name: ${caseData.witnessNames[0]}`)).toBeVisible();
        for (const defendant of caseData.defendantNames) {
          await expect(powerApp_ScheduleRecordingPage.iFrame.getByText('Defendants: ')).toContainText(defendant);
        }
      });
    },
  );

  test(
    'Verify user is able to delete a booking that has been scheduled',
    {
      tag: ['@regression', '@functional'],
    },
    async ({
      powerApp_ScheduleRecordingPage,
      apiClient,
      navigateToPowerAppManageBookingsPage,
      powerApp_ManageBookingsPage,
      navigateToPowerAppScheduleRecordingsPage,
    }) => {
      await test.step('Pre-requisite step in order to create a booking via api and navigate to schedule recordings page', async () => {
        const caseData = await apiClient.createBooking(2, 2, 'today');
        await navigateToPowerAppScheduleRecordingsPage(caseData.caseReference);
      });

      await test.step('Verify recording scheduled is visisble', async () => {
        await powerApp_ScheduleRecordingPage.verifyAllScheduledRecordingsAreVisible(1);
      });

      await test.step('Verify user is able to delete scheduled recording', async () => {
        await powerApp_ScheduleRecordingPage.$interactive.deleteScheduledRecordingButton.click();
        await expect(powerApp_ScheduleRecordingPage.$deleteScheduleModal.modalWindow).toBeVisible();
        await powerApp_ScheduleRecordingPage.$deleteScheduleModal.yesButton.click();

        await expect(
          powerApp_ScheduleRecordingPage.iFrame.locator('[data-control-name="bookingScrn_BookingsGallery_Gal"] [role="listitem"]'),
        ).not.toBeAttached();
      });

      await test.step('Navigate to manage bookings page', async () => {
        await navigateToPowerAppManageBookingsPage();
      });

      await test.step('Verify user is unable to find deleted scheduled recording within manage bookings page', async () => {
        const caseData = await apiClient.getCaseData();
        await powerApp_ManageBookingsPage.$inputs.caseReference.fill(caseData.caseReference);
        await expect(powerApp_ManageBookingsPage.$inputs.caseReference).toHaveValue(caseData.caseReference);

        await expect(async () => {
          if ((await powerApp_ManageBookingsPage.$static.listItemsInSearchResultsGallery.count()) > 0) {
            await powerApp_ManageBookingsPage.$interactive.refreshResultsButton.click();
            // eslint-disable-next-line playwright/no-conditional-expect
            await expect(powerApp_ManageBookingsPage.$static.listItemsInSearchResultsGallery).toHaveCount(0);
          }

          await expect(powerApp_ManageBookingsPage.$static.caseReferenceLabelInSearchList).not.toBeAttached();
        }).toPass({ intervals: [3000], timeout: 12000 });
      });
    },
  );

  test(
    'Verify user is unable to delete a scheduled booking that has a recording',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ powerApp_ScheduleRecordingPage, apiClient, navigateToPowerAppScheduleRecordingsPage }) => {
      await test.step('Pre-requisite step in order to create a case / assign a recording via api and navigate to schedule recordings page', async () => {
        await apiClient.createANewCaseAndAssignRecording(2, 2);
        const caseData = await apiClient.getCaseData();
        await navigateToPowerAppScheduleRecordingsPage(caseData.caseReference);
      });

      await test.step('Verify recording scheduled is visisble', async () => {
        await powerApp_ScheduleRecordingPage.verifyAllScheduledRecordingsAreVisible(1);
      });

      await test.step('Verify delete button is disabled', async () => {
        await expect(powerApp_ScheduleRecordingPage.$interactive.deleteScheduledRecordingButton).toBeDisabled();
      });
    },
  );
});
