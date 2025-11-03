import { test, expect } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify buttons on the case details page are in the correct state', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppCaseDetailsPage }) => {
    await navigateToPowerAppCaseDetailsPage();
  });

  test(
    'Verify when accessing the CaseDetailsPage all the three buttons are in the correct state',
    {
      tag: ['@regression', '@state-management'],
    },
    async ({ powerApp_CaseDetailsPage }) => {
      await test.step('Verify all the buttons on case details page are visible', async () => {
        await expect(powerApp_CaseDetailsPage.$interactive.modifyButton).toBeVisible();
        await expect(powerApp_CaseDetailsPage.$interactive.saveButton).toBeVisible();
        await expect(powerApp_CaseDetailsPage.$interactive.bookingsButton).toBeVisible();
      });
      await test.step('Verify modify and bookings buttons are disabled when accessing case details page', async () => {
        await expect(powerApp_CaseDetailsPage.$interactive.modifyButton).toBeDisabled();
        await expect(powerApp_CaseDetailsPage.$interactive.bookingsButton).toBeDisabled();
      });
      await test.step('Verify save button is enabled when accessing case details page', async () => {
        await expect(powerApp_CaseDetailsPage.$interactive.saveButton).toBeEnabled();
      });
    },
  );
  test(
    'Verify when selecting an exisiting case, four buttons are in the correct state',
    {
      tag: ['@regression', '@state-management'],
    },
    async ({ powerApp_CaseDetailsPage, apiClient }) => {
      await test.step('Pre-requisite step in order to create a case via api', async () => {
        await apiClient.createCase(2, 2);
      });
      const caseData = await apiClient.getCaseData();
      await powerApp_CaseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);

      await test.step('Verify all four buttons are visible', async () => {
        await expect(powerApp_CaseDetailsPage.$interactive.selectedCaseCloseButton).toBeVisible();
        await expect(powerApp_CaseDetailsPage.$interactive.modifyButton).toBeVisible();
        await expect(powerApp_CaseDetailsPage.$interactive.bookingsButton).toBeVisible();
        await expect(powerApp_CaseDetailsPage.$interactive.saveButton).toBeVisible();
      });
      await test.step('Verify three buttons are enabled', async () => {
        await expect(powerApp_CaseDetailsPage.$interactive.selectedCaseCloseButton).toBeEnabled();
        await expect(powerApp_CaseDetailsPage.$interactive.modifyButton).toBeEnabled();
        await expect(powerApp_CaseDetailsPage.$interactive.bookingsButton).toBeEnabled();
      });
      await test.step('Verify save button is disabled upon selecting an exisiting case', async () => {
        await expect(powerApp_CaseDetailsPage.$interactive.saveButton).toBeDisabled();
      });
    },
  );

  test(
    'Verify when selecting options to close case,all the buttons are in the correct state',
    {
      tag: ['@regression', '@state-management'],
    },
    async ({ powerApp_CaseDetailsPage, apiClient }) => {
      await test.step('Pre-requisite step in order to create and select a new case', async () => {
        const caseData = await apiClient.createCase(2, 2);
        await powerApp_CaseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);
        await powerApp_CaseDetailsPage.$interactive.selectedCaseCloseButton.click();
      });

      await test.step('Verify buttons to cancel or save are visible upon selecting close case button', async () => {
        await expect(powerApp_CaseDetailsPage.$interactive.selectedCaseCancelPendingClosureButton).toBeVisible();
        await expect(powerApp_CaseDetailsPage.$closeCaseModal.saveButton).toBeVisible();
      });

      await test.step('Verify buttons to cancel or save are enabled upon selecting close case button', async () => {
        await expect(powerApp_CaseDetailsPage.$interactive.selectedCaseCancelPendingClosureButton).toBeEnabled();
        await expect(powerApp_CaseDetailsPage.$closeCaseModal.saveButton).toBeEnabled();
      });

      await test.step('Verify buttons to select yes or no are visible upon selecting save button', async () => {
        await powerApp_CaseDetailsPage.$closeCaseModal.saveButton.click();
        await expect(powerApp_CaseDetailsPage.$closeCaseModal.yesButton).toBeVisible();
        await expect(powerApp_CaseDetailsPage.$closeCaseModal.noButton).toBeVisible();
      });

      await test.step('Verify buttons to select yes or no are enabled upon selecting save button', async () => {
        await expect(powerApp_CaseDetailsPage.$closeCaseModal.yesButton).toBeEnabled();
        await expect(powerApp_CaseDetailsPage.$closeCaseModal.noButton).toBeEnabled();
      });
    },
  );
});
