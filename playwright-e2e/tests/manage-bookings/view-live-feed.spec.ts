import { test, expect } from '../../fixtures';
import { config } from '../../utils';

test.describe('Set of tests to verify view live feed page for Level 1 user', () => {
  const user = config.powerAppUsers.preLevel1User;
  test.use({ storageState: user.sessionFile });

  test.beforeEach(async ({ navigateToViewLiveFeedPage, apiClient }) => {
    const bookingData = await apiClient.createBooking(2, 2, 'today');
    await navigateToViewLiveFeedPage(bookingData.caseReference);
  });

  test(
    'Verify recording begins processing after user has started and finished a recording',
    {
      tag: '@smoke',
    },
    async ({
      apiClient,
      viewLiveFeedPage,
      cvp_SignInPage,
      cvp_RoomSettingsPage,
      cvp_ConferencePage,
      cvp_SelectRolePage,
      cvp_RecordingCallPage,
      processingRecordingsPage,
      networkInterceptUtils,
    }) => {
      const bookingData = await apiClient.getBookingData();
      let rtmpsLink: string;
      let hostPin: string;

      await test.step('Given I obtain a recording link', async () => {
        await viewLiveFeedPage.page.bringToFront();
        rtmpsLink = await viewLiveFeedPage.startRecordingAndCaptureRtmpsLink();
      });

      await test.step('And I configure a cvp room with my recording link', async () => {
        await cvp_SignInPage.page.bringToFront();
        await cvp_SignInPage.goTo();
        await cvp_SignInPage.verifyUserIsOnCvpSignInPage();
        await cvp_SignInPage.signIn(config.cvpUser.username, config.cvpUser.password);

        await cvp_RoomSettingsPage.verifyUserIsOnCvpRoomSettingsPage();
        await cvp_RoomSettingsPage.selectRoomFromDropdown('PRE009');
        hostPin = await cvp_RoomSettingsPage.editRoomSettings(rtmpsLink);
      });

      await test.step('When I connect to the conference using the host pin', async () => {
        await cvp_ConferencePage.page.bringToFront();
        await cvp_ConferencePage.goTo();
        await cvp_ConferencePage.verifyUserIsOnCvpConferencePage();
        await cvp_ConferencePage.connectToConference(config.cvpUser.cvpConferenceUser, bookingData.witnessNames[0]);

        await cvp_SelectRolePage.verifyUserIsOnCvpSelectRolePage();
        await cvp_SelectRolePage.connectAsHost(hostPin);
        await cvp_RecordingCallPage.verifyUserIsOnCvpRecordingCallPage();
      });

      await test.step('And I begin recording', async () => {
        await cvp_RoomSettingsPage.page.bringToFront();
        await cvp_RoomSettingsPage.beginRecording(config.cvpUser.serviceId, config.cvpUser.locationCode, bookingData.caseReference);
      });

      await test.step('Then I am able to verify recording has started', async () => {
        await viewLiveFeedPage.page.bringToFront();
        await networkInterceptUtils.interceptNetworkRequestToVerifyRecordingIsTakingPlace(bookingData.caseReference, 60000);
      });

      await test.step('When I end the call in cvp, I am disconnected from the call', async () => {
        await cvp_RoomSettingsPage.page.bringToFront();
        await cvp_RoomSettingsPage.$interactive.endCallButton.click();
        await expect(cvp_RoomSettingsPage.$interactive.recordButton).toBeVisible();

        await cvp_RecordingCallPage.page.bringToFront();
        await cvp_RecordingCallPage.verifyUserHasBeenDisconnectedFromCall();
        await cvp_ConferencePage.verifyUserIsOnCvpConferencePage();
      });
      await test.step('Then I successfully finish recording in power app', async () => {
        await viewLiveFeedPage.page.bringToFront();
        await viewLiveFeedPage.finishRecording();
      });
      await test.step('And recording is being processed in power app', async () => {
        await processingRecordingsPage.verifyUserIsOnProcessingRecordingsPage();
        await processingRecordingsPage.verifyRecordingIsBeingProcessed(bookingData.caseReference);
      });
    },
  );
});
