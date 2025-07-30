import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';

test.describe('Set of tests to verify buttons on the case details page are in the correct state', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeEach(async ({ navigateToCaseDetailsPage }) => {
    await navigateToCaseDetailsPage();
  });

  test(
    'Verify when accessing the caseDetailsPage all the three buttons are in the correct state',
    {
      tag: '@regression',
    },
    async ({ caseDetailsPage }) => {
      await test.step('Verify all the buttons on case details page are visible', async () => {
        await expect(caseDetailsPage.$interactive.modifyButton).toBeVisible();
        await expect(caseDetailsPage.$interactive.saveButton).toBeVisible();
        await expect(caseDetailsPage.$interactive.bookingsButton).toBeVisible();
      });
      await test.step('Verify modify and bookings buttons are disabled when accessing case details page', async () => {
        await expect(caseDetailsPage.$interactive.modifyButton).toBeDisabled();
        await expect(caseDetailsPage.$interactive.bookingsButton).toBeDisabled();
      });
      await test.step('Verify save button is enabled when accessing case details page', async () => {
        await expect(caseDetailsPage.$interactive.saveButton).toBeEnabled();
      });
    },
  );
  test(
    'Verify when selecting an exisiting case, four buttons are in the correct state',
    {
      tag: '@regression',
    },
    async ({ caseDetailsPage, apiClient }) => {
      await test.step('Pre-requisite step in order to create a case via api', async () => {
        await apiClient.createCase(2, 2);
      });
      const caseData = await apiClient.getCaseData();
      await caseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);

      await test.step('Verify all four buttons are visible', async () => {
        await expect(caseDetailsPage.$interactive.searchedCaseCloseButton).toBeVisible();
        await expect(caseDetailsPage.$interactive.modifyButton).toBeVisible();
        await expect(caseDetailsPage.$interactive.bookingsButton).toBeVisible();
        await expect(caseDetailsPage.$interactive.saveButton).toBeVisible();
      });
      await test.step('Verify three buttons are enabled upon selecting an exisiting case', async () => {
        await expect(caseDetailsPage.$interactive.searchedCaseCloseButton).toBeEnabled();
        await expect(caseDetailsPage.$interactive.modifyButton).toBeEnabled();
        await expect(caseDetailsPage.$interactive.bookingsButton).toBeEnabled();
      });
      await test.step('Verify save button is disabled upon selecting an exisiting case', async () => {
        await expect(caseDetailsPage.$interactive.saveButton).toBeDisabled();
      });
    },
  );

  test(
    'Verify when selecting options to close case,all the buttons are in the correct state',
    {
      tag: '@regression',
    },
    async ({ caseDetailsPage, apiClient }) => {
      await test.step('Pre-requisite step in order to select the exisitig case and check all the buttons are in correct states', async () => {
        await apiClient.createCase(2, 2);
      });
      const caseData = await apiClient.getCaseData();
      await caseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);
      await caseDetailsPage.$interactive.searchedCaseCloseButton.click();

      await test.step('Verify two buttons in order to cancel or save are visible selecting close case button', async () => {
        await expect(caseDetailsPage.$interactive.closeCaseCancelButton).toBeEnabled();
        await expect(caseDetailsPage.$interactive.saveButton).toBeEnabled();

        await test.step('Verify by clicking a cancle button', async () => {
          await caseDetailsPage.$interactive.closeCaseCancelButton.click();
        });
      });
    },
  );

  test(
    'Verify once save button has been selected within close case modal, option to select yes and no buttons are visible',
    {
      tag: '@regression',
    },
    async ({ caseDetailsPage, apiClient }) => {
      await test.step('Pre-requisite step in order to click save and check all the buttons are in correct states', async () => {
        await apiClient.createCase(2, 2);
      });
      const caseData = await apiClient.getCaseData();
      await caseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);
      await caseDetailsPage.$interactive.searchedCaseCloseButton.click();

      await test.step('Verify by clicking a save button', async () => {
        await caseDetailsPage.$interactive.saveButton.click();
      });

      await test.step('Verify all the buttons are visible when click save', async () => {
        await expect(caseDetailsPage.$interactive.yesButton).toBeVisible();
        await expect(caseDetailsPage.$interactive.noButton).toBeVisible();
      });
    },
  );
});
