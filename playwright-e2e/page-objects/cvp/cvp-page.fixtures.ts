import { Page } from 'playwright-core';
import * as Pages from './index.js';

export interface CvpPageFixtures {
  cvp_CreateNewTabForConfig: Page;
  cvp_createNewTabForConference: Page;
  cvp_SignInPage: Pages.CvpSignInPage;
  cvp_RoomSettingsPage: Pages.CvpRoomSettingsPage;
  cvp_ConferencePage: Pages.CvpConferencePage;
  cvp_SelectRolePage: Pages.CvpSelectRolePage;
  cvp_RecordingCallPage: Pages.CvpRecordingCallPage;
}

export const cvpPageFixtures = {
  cvp_CreateNewTabForConfig: async ({ context }, use) => {
    const newPage = await context.newPage();
    await use(newPage);
  },
  cvp_createNewTabForConference: async ({ context }, use) => {
    const newPage = await context.newPage();
    await use(newPage);
  },
  cvp_SignInPage: async ({ cvp_CreateNewTabForConfig }, use) => {
    const signInPage = new Pages.CvpSignInPage(cvp_CreateNewTabForConfig);
    await use(signInPage);
  },
  cvp_RoomSettingsPage: async ({ cvp_CreateNewTabForConfig }, use) => {
    const roomSettingsPage = new Pages.CvpRoomSettingsPage(cvp_CreateNewTabForConfig);
    await use(roomSettingsPage);
  },
  cvp_ConferencePage: async ({ cvp_createNewTabForConference }, use) => {
    const conferencePage = new Pages.CvpConferencePage(cvp_createNewTabForConference);
    await use(conferencePage);
  },
  cvp_SelectRolePage: async ({ cvp_createNewTabForConference }, use) => {
    const selectRolePage = new Pages.CvpSelectRolePage(cvp_createNewTabForConference);
    await use(selectRolePage);
  },
  cvp_RecordingCallPage: async ({ cvp_createNewTabForConference }, use) => {
    const recordingCallPage = new Pages.CvpRecordingCallPage(cvp_createNewTabForConference);
    await use(recordingCallPage);
  },
};
