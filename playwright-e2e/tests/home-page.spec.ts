/* eslint-disable playwright/no-skipped-test */
import { test, expect } from '../fixtures';
import { config } from '../utils';

test.describe('Home Page', () => {
  test.use({ storageState: config.users.preUser.sessionFile });

  test.beforeEach(async ({ homePage }) => {
    await homePage.goTo();
    await homePage.verifyHeadingIsVisible();
  });

  test(
    'Verify user is presented with the homepage',
    {
      tag: '@smoke',
    },
    async ({ homePage }) => {
      await test.step('Verify all buttons on homepage are visible', async () => {
        await expect(homePage.$bookARecordingButton).toBeVisible();
        await expect(homePage.$manageBookingsButton).toBeVisible();
        await expect(homePage.$viewRecordingsButton).toBeVisible();
        await expect(homePage.$adminButton).toBeVisible();
      });

      await test.step('Verify all buttons on homepage are enabled', async () => {
        await expect(homePage.$bookARecordingButton).toBeEnabled();
        await expect(homePage.$manageBookingsButton).toBeEnabled();
        await expect(homePage.$viewRecordingsButton).toBeEnabled();
        await expect(homePage.$adminButton).toBeEnabled();
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
