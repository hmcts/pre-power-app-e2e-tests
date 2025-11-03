import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';

test.describe('Set of tests to verify the homepage buttons are in the correct state', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppHomePage }) => {
    await navigateToPowerAppHomePage();
  });

  test(
    'Verify all buttons on the homepage are visible and enabled',
    {
      tag: ['@regression', '@state-management'],
    },
    async ({ powerApp_HomePage }) => {
      await test.step('Verify all buttons on homepage are visible', async () => {
        await expect(powerApp_HomePage.$interactive.bookARecordingButton).toBeVisible();
        await expect(powerApp_HomePage.$interactive.manageBookingsButton).toBeVisible();
        await expect(powerApp_HomePage.$interactive.viewRecordingsButton).toBeVisible();
        await expect(powerApp_HomePage.$interactive.adminButton).toBeVisible();
      });

      await test.step('Verify all buttons on homepage are enabled', async () => {
        await expect(powerApp_HomePage.$interactive.bookARecordingButton).toBeEnabled();
        await expect(powerApp_HomePage.$interactive.manageBookingsButton).toBeEnabled();
        await expect(powerApp_HomePage.$interactive.viewRecordingsButton).toBeEnabled();
        await expect(powerApp_HomePage.$interactive.adminButton).toBeEnabled();
      });
    },
  );
});
