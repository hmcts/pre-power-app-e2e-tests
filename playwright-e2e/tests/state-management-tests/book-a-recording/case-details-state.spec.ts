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
      tag: '@Regression',
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
});
