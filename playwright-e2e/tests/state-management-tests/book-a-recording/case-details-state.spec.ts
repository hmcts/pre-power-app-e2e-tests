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
      tag: ['@regression', '@state-management'],
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
      tag: ['@regression', '@state-management'],
    },
    async ({ caseDetailsPage, apiClient }) => {
      await test.step('Pre-requisite step in order to create a case via api', async () => {
        await apiClient.createCase(2, 2);
      });
      const caseData = await apiClient.getCaseData();
      await caseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);

      await test.step('Verify all four buttons are visible', async () => {
        await expect(caseDetailsPage.$interactive.selectedCaseCloseButton).toBeVisible();
        await expect(caseDetailsPage.$interactive.modifyButton).toBeVisible();
        await expect(caseDetailsPage.$interactive.bookingsButton).toBeVisible();
        await expect(caseDetailsPage.$interactive.saveButton).toBeVisible();
      });
      await test.step('Verify three buttons are enabled', async () => {
        await expect(caseDetailsPage.$interactive.selectedCaseCloseButton).toBeEnabled();
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
      tag: ['@regression', '@state-management'],
    },
    async ({ caseDetailsPage, apiClient }) => {
      await test.step('Pre-requisite step in order to create and select a new case', async () => {
        const caseData = await apiClient.createCase(2, 2);
        await caseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);
        await caseDetailsPage.$interactive.selectedCaseCloseButton.click();
      });

      await test.step('Verify buttons to cancel or save are visible upon selecting close case button', async () => {
        await expect(caseDetailsPage.$interactive.selectedCaseCancelPendingClosureButton).toBeVisible();
        await expect(caseDetailsPage.$closeCaseModal.saveButton).toBeVisible();
      });

      await test.step('Verify buttons to cancel or save are enabled upon selecting close case button', async () => {
        await expect(caseDetailsPage.$interactive.selectedCaseCancelPendingClosureButton).toBeEnabled();
        await expect(caseDetailsPage.$closeCaseModal.saveButton).toBeEnabled();
      });

      await test.step('Verify buttons to select yes or no are visible upon selecting save button', async () => {
        await caseDetailsPage.$closeCaseModal.saveButton.click();
        await expect(caseDetailsPage.$closeCaseModal.yesButton).toBeVisible();
        await expect(caseDetailsPage.$closeCaseModal.noButton).toBeVisible();
      });

      await test.step('Verify buttons to select yes or no are enabled upon selecting save button', async () => {
        await expect(caseDetailsPage.$closeCaseModal.yesButton).toBeEnabled();
        await expect(caseDetailsPage.$closeCaseModal.noButton).toBeEnabled();
      });
    },
  );
});
