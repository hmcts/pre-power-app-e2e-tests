import { Page } from 'playwright-core';
import { CvpSignInPage, CvpRoomSettingsPage, CvpConferencePage, CvpSelectRolePage, CvpRecordingCallPage } from './index.js';

export interface CvpPageFixtures {
  cvp_CreateNewTabForConfig: Page;
  cvp_createNewTabForConference: Page;
  cvp_SignInPage: CvpSignInPage;
  cvp_RoomSettingsPage: CvpRoomSettingsPage;
  cvp_ConferencePage: CvpConferencePage;
  cvp_SelectRolePage: CvpSelectRolePage;
  cvp_RecordingCallPage: CvpRecordingCallPage;
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
    const signInPage = new CvpSignInPage(cvp_CreateNewTabForConfig);
    await use(signInPage);
  },
  cvp_RoomSettingsPage: async ({ cvp_CreateNewTabForConfig }, use) => {
    const roomSettingsPage = new CvpRoomSettingsPage(cvp_CreateNewTabForConfig);
    await use(roomSettingsPage);
  },
  cvp_ConferencePage: async ({ cvp_createNewTabForConference }, use) => {
    const conferencePage = new CvpConferencePage(cvp_createNewTabForConference);
    await use(conferencePage);
  },
  cvp_SelectRolePage: async ({ cvp_createNewTabForConference }, use) => {
    const selectRolePage = new CvpSelectRolePage(cvp_createNewTabForConference);
    await use(selectRolePage);
  },
  cvp_RecordingCallPage: async ({ cvp_createNewTabForConference }, use) => {
    const recordingCallPage = new CvpRecordingCallPage(cvp_createNewTabForConference);
    await use(recordingCallPage);
  },
};
