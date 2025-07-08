import { AxeUtils, BrowserUtils, LighthouseUtils, SessionUtils, WaitUtils } from '@hmcts/playwright-common';
import os from 'os';
import path from 'path';
import { chromium, Page } from 'playwright/test';
import * as utils from './index';

export interface UtilsFixtures {
  config: utils.Config;
  waitUtils: WaitUtils;
  axeUtils: AxeUtils;
  SessionUtils: typeof SessionUtils;
  browserUtils: BrowserUtils;
  lighthouseUtils: LighthouseUtils;
  lighthousePage: Page;
  dataUtils: utils.DataUtils;
  networkInterceptUtils: utils.NetworkInterceptUtils;
}

export const utilsFixtures = {
  config: async ({}, use) => {
    await use(utils.config);
  },
  dataUtils: async ({}, use) => {
    await use(new utils.DataUtils());
  },
  networkInterceptUtils: async ({ page }, use) => {
    await use(new utils.NetworkInterceptUtils(page));
  },
  waitUtils: async ({}, use) => {
    await use(new WaitUtils());
  },
  lighthouseUtils: async ({ lighthousePage, lighthousePort }, use) => {
    await use(new LighthouseUtils(lighthousePage, lighthousePort));
  },
  axeUtils: async ({ page }, use) => {
    await use(new AxeUtils(page));
  },
  SessionUtils: async ({}, use) => {
    await use(SessionUtils);
  },
  browserUtils: async ({ browser }, use) => {
    await use(new BrowserUtils(browser));
  },
  lighthousePage: async ({ lighthousePort, page, SessionUtils }, use, testInfo) => {
    // Prevent creating performance page if not needed
    if (testInfo.tags.includes('@performance')) {
      // Lighthouse opens a new page and as playwright doesn't share context we need to
      // explicitly create a new browser with shared context
      const userDataDir = path.join(os.tmpdir(), 'pw', String(Math.random()));
      const context = await chromium.launchPersistentContext(userDataDir, {
        args: [`--remote-debugging-port=${lighthousePort}`],
      });
      // Using the cookies from global setup, inject to the new browser
      await context.addCookies(SessionUtils.getCookies(utils.config.users.preUser.sessionFile));
      // Provide the page to the test
      await use(context.pages()[0]);
      await context.close();
    } else {
      await use(page);
    }
  },
};
