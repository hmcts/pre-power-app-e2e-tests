import { test, expect } from '../../fixtures';
import { config } from '../../utils';

test.describe('Set of tests to verify the homepage buttons are in the correct state', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeEach(async ({ navigateToHomePage }) => {
    await navigateToHomePage();
  });

  test(
    'Verify all buttons on the homepage are visible and enabled',
    {
      tag: ['@regression', '@state-management'],
    },
    async ({ homePage }) => {
      await test.step('Verify all buttons on homepage are visible', async () => {
        await expect(homePage.$interactive.bookARecordingButton).toBeVisible();
        await expect(homePage.$interactive.manageBookingsButton).toBeVisible();
        await expect(homePage.$interactive.viewRecordingsButton).toBeVisible();
        await expect(homePage.$interactive.adminButton).toBeVisible();
      });

      await test.step('Verify all buttons on homepage are enabled', async () => {
        await expect(homePage.$interactive.bookARecordingButton).toBeEnabled();
        await expect(homePage.$interactive.manageBookingsButton).toBeEnabled();
        await expect(homePage.$interactive.viewRecordingsButton).toBeEnabled();
        await expect(homePage.$interactive.adminButton).toBeEnabled();
      });
    },
  );
});
