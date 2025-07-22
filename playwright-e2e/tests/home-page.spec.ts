/* eslint-disable playwright/no-skipped-test */
import { test, expect } from '../fixtures';
import { config } from '../utils';

test.describe('Set of tests to verify the homepage UI', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeEach(async ({ navigateToHomePage }) => {
    await navigateToHomePage();
  });

  test(
    'Verify user is presented with the homepage',
    {
      tag: '@smoke',
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

  test(
    'Verify homepage is visually correct',
    {
      tag: '@visual',
    },
    async ({ page, homePage, headless }) => {
      test.skip(!headless, 'Skipping visual test in headed mode');
      await expect(page).toHaveScreenshot('home-page-visual.png', {
        mask: [
          homePage.iFrame.locator('[aria-label="Current Version"]'),
          homePage.iFrame.locator('[class="appmagic-label-text"]'),
          page.locator('[id*="HeaderContainer"]'),
        ],
      });
    },
  );
});
