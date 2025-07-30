import { AxeUtils, BrowserUtils, LighthouseUtils, SessionUtils, WaitUtils } from '@hmcts/playwright-common';
import os from 'os';
import path from 'path';
import { chromium, Page } from 'playwright/test';
import { config, Config, DataUtils, NetworkInterceptUtils, UserInterfaceUtils } from './index';

export interface UtilsFixtures {
  config: Config;
  waitUtils: WaitUtils;
  axeUtils: AxeUtils;
  SessionUtils: typeof SessionUtils;
  browserUtils: BrowserUtils;
  lighthouseUtils: LighthouseUtils;
  lighthousePage: Page;
  dataUtils: DataUtils;
  networkInterceptUtils: NetworkInterceptUtils;
  userInterfaceUtils: UserInterfaceUtils;
}

export const utilsFixtures = {
  config: async ({}, use) => {
    await use(config);
  },
  dataUtils: async ({}, use) => {
    await use(new DataUtils());
  },
  networkInterceptUtils: async ({ page }, use) => {
    await use(new NetworkInterceptUtils(page));
  },
  userInterfaceUtils: async ({ page }, use) => {
    await use(new UserInterfaceUtils(page));
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
      await context.addCookies(SessionUtils.getCookies(config.powerAppUsers.preLevel1User.sessionFile));
      // Provide the page to the test
      await use(context.pages()[0]);
      await context.close();
    } else {
      await use(page);
    }
  },
};
