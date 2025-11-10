import { test, expect } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify functionality of manage bookings page', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppManageBookingsPage }) => {
    await navigateToPowerAppManageBookingsPage();
  });

  test(
    'Verify user is able to find a booking by selecting a date from the date picker',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ powerApp_ManageBookingsPage, apiClient, dataUtils }) => {
      await test.step('Pre-requisite step in order to create a booking for tomorrow via api', async () => {
        await apiClient.createNewCaseAndScheduleABooking(2, 2, 'tomorrow');
      });

      await test.step('Verify todays date is default within date picker', async () => {
        const formattedTodaysDate = dataUtils.getShortDateWithAbbreviatedDayMonth();
        await powerApp_ManageBookingsPage.$interactive.datePicker.click();
        await expect(powerApp_ManageBookingsPage.$datePickerModal.modalWindow).toHaveAttribute('aria-hidden', 'false');
        await expect(powerApp_ManageBookingsPage.iFrame.locator("[class*='is-today'] button")).toHaveAttribute('aria-label', formattedTodaysDate);
      });

      await test.step('Select date for tomorrow via date picker', async () => {
        await powerApp_ManageBookingsPage.selectDateFromDatePicker({ days: 1 });
      });

      await test.step('Verify booking case reference is returned within list of results for tomorrows date', async () => {
        const caseData = await apiClient.getCaseData();
        await expect(powerApp_ManageBookingsPage.$static.caseReferenceLabelInSearchList.filter({ hasText: caseData.caseReference })).toBeVisible();
      });
    },
  );
});
