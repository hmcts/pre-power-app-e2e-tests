import { Page } from '@playwright/test';
import * as Pages from './index.js';

export interface PageFixtures {
  determinePage: Page;
  msSignInPage: Pages.MsSignInPage;
  homePage: Pages.HomePage;
  caseDetailsPage: Pages.CaseDetailsPage;
  scheduleRecordingPage: Pages.ScheduleRecording;
}

/* Instantiates pages and provides page to the test via use()
 * can also contain steps before or after providing the page
 * this is the same behaviour as a beforeEach/afterEach hook
 */
export const pageFixtures = {
  // If a performance test is executed, use the lighthouse created page instead
  determinePage: async ({ page, lighthousePage }, use, testInfo) => {
    if (testInfo.tags.includes('@performance')) {
      await use(lighthousePage);
    } else {
      await use(page);
    }
  },
  msSignInPage: async ({ determinePage }, use) => {
    const msSignInPage = new Pages.MsSignInPage(determinePage);
    await use(msSignInPage);
  },
  homePage: async ({ determinePage }, use) => {
    const homePage = new Pages.HomePage(determinePage);
    await use(homePage);
  },
  caseDetailsPage: async ({ determinePage }, use) => {
    const caseDetailsPage = new Pages.CaseDetailsPage(determinePage);
    await use(caseDetailsPage);
  },
  scheduleRecordingPage: async ({ determinePage }, use) => {
    const scheduleRecordingPage = new Pages.ScheduleRecording(determinePage);
    await use(scheduleRecordingPage);
  },
};
