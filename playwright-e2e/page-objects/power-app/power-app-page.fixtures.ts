import { Page } from '@playwright/test';
import * as Pages from './pages/index.js';
import * as Components from './components/index.js';

export interface PowerAppPageFixtures {
  determinePage: Page;
  msSignInPage: Pages.MsSignInPage;
  homePage: Pages.HomePage;
  caseDetailsPage: Pages.CaseDetailsPage;
  scheduleRecordingPage: Pages.ScheduleRecording;
  navBarComponent: Components.NavBarComponent;
  manageBookingsPage: Pages.ManageBookingsPage;
  viewLiveFeedPage: Pages.ViewLiveFeedPage;
  processingRecordingsPage: Pages.ProcessingRecordingsPage;
  navigateToHomePage: () => Promise<void>;
  navigateToCaseDetailsPage: () => Promise<void>;
  navigateToScheduleRecordingsPage: (caseReference: string) => Promise<void>;
  navigateToManageBookingsPage: () => Promise<void>;
  navigateToViewLiveFeedPage: (caseReference: string) => Promise<void>;
}

/* Instantiates pages and provides page to the test via use()
 * can also contain steps before or after providing the page
 * this is the same behaviour as a beforeEach/afterEach hook
 */
export const powerAppPageFixtures = {
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
  navBarComponent: async ({ determinePage }, use) => {
    const navBarComponent = new Components.NavBarComponent(determinePage);
    await use(navBarComponent);
  },
  manageBookingsPage: async ({ determinePage }, use) => {
    const manageBookingsPage = new Pages.ManageBookingsPage(determinePage);
    await use(manageBookingsPage);
  },
  viewLiveFeedPage: async ({ determinePage }, use) => {
    const viewLiveFeedPage = new Pages.ViewLiveFeedPage(determinePage);
    await use(viewLiveFeedPage);
  },
  processingRecordingsPage: async ({ determinePage }, use) => {
    const processingRecordingsPage = new Pages.ProcessingRecordingsPage(determinePage);
    await use(processingRecordingsPage);
  },
  navigateToHomePage: async ({ homePage }, use) => {
    await use(async () => {
      await homePage.goTo();
      await homePage.verifyUserIsOnHomePage();
    });
  },
  navigateToCaseDetailsPage: async ({ navigateToHomePage, homePage, caseDetailsPage }: PowerAppPageFixtures, use) => {
    await use(async () => {
      await navigateToHomePage();
      await homePage.$interactive.bookARecordingButton.click();
      await caseDetailsPage.verifyUserIsOnCaseDetailsPage();
    });
  },
  navigateToScheduleRecordingsPage: async ({ navigateToCaseDetailsPage, caseDetailsPage, scheduleRecordingPage }: PowerAppPageFixtures, use) => {
    await use(async (caseReference: string) => {
      await navigateToCaseDetailsPage();
      await caseDetailsPage.searchAndSelectExistingCase(caseReference);
      await caseDetailsPage.$interactive.bookingsButton.click();
      await scheduleRecordingPage.verifyUserIsOnScheduleRecordingsPage();
    });
  },
  navigateToManageBookingsPage: async ({ navigateToHomePage, homePage, manageBookingsPage }: PowerAppPageFixtures, use) => {
    await use(async () => {
      await navigateToHomePage();
      await homePage.$interactive.manageBookingsButton.click();
      await manageBookingsPage.verifyUserIsOnManageBookingsPage();
    });
  },
  navigateToViewLiveFeedPage: async ({ navigateToManageBookingsPage, manageBookingsPage, viewLiveFeedPage }: PowerAppPageFixtures, use) => {
    await use(async (caseReference: string) => {
      await navigateToManageBookingsPage();
      await manageBookingsPage.searchForABooking(caseReference);
      await manageBookingsPage.$interactive.recordButton.click();
      await viewLiveFeedPage.verifyUserIsOnViewLiveFeedPage();
    });
  },
};
