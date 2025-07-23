/* eslint-disable playwright/no-skipped-test */
import { test, expect } from '../../fixtures';
import { config } from '../../utils';

test.describe('Set of tests to verify the homepage UI is visually correct', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeEach(async ({ navigateToHomePage }) => {
    await navigateToHomePage();
  });

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
