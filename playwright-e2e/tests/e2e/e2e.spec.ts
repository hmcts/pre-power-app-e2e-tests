import { test, expect } from '../../fixtures';
import { BaseCaseDetails } from '../../types';
import { config } from '../../utils';

test.describe('Ensure e2e journey is working as expected', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeEach(async ({ navigateToHomePage }) => {
    await navigateToHomePage();
  });

  test(
    'Verify user is able to complete the e2e journey',
    {
      tag: ['@smoke', '@e2e'],
    },
    async ({
      navBarComponent,
      homePage,
      caseDetailsPage,
      dataUtils,
      scheduleRecordingPage,
      manageBookingsPage,
      viewLiveFeedPage,
      cvp_SignInPage,
      cvp_RoomSettingsPage,
      cvp_ConferencePage,
      cvp_SelectRolePage,
      cvp_RecordingCallPage,
      networkInterceptUtils,
      processingRecordingsPage,
      viewRecordingsPage,
      apiClient,
    }) => {
      /**
       * Increased the timeout to allow e2e journey to complete, set to a total of 9 minutes.
       * This ensures the test has sufficient time for the following:
       * Navigating between pages
       * Waiting for recording link to be generated
       * Waiting for network request to confirm the recording is taking place
       * Waiting for the recording to be processed and appear in the view recordings page.
       * Note: The processing of recordings can take a significant amount of time, I have for now placed a limit of 5 minutes prompting investigation when exceeded.
       * Video processing is done by media kind which works in order of a queue to process 2 at a time, so if there are multiple recordings being processed, it can take longer.
       * There has been an addition of a Cron job on (24/07/2025) to check the status of recordings which has a default polling interval of 5 minutes however reduced to 1 minute for lower Envs.
       */
      test.setTimeout(540_000);
      const caseDetails: BaseCaseDetails = dataUtils.generateRandomCaseDetails(2, 2);
      let rtmpsLink: string;
      let hostPin: string;

      await test.step('Verify user is able to open a new case', async () => {
        await homePage.page.bringToFront();
        await homePage.$interactive.bookARecordingButton.click();
        await caseDetailsPage.verifyUserIsOnCaseDetailsPage();
        await caseDetailsPage.populateCaseDetails({
          caseReference: caseDetails.caseReference,
          defendantNames: caseDetails.defendantNames,
          witnessNames: caseDetails.witnessNames,
        });
        await caseDetailsPage.$interactive.saveButton.click();
        await scheduleRecordingPage.verifyUserIsOnScheduleRecordingsPage();
      });

      await test.step('Verify user is able to book a recording for the new case', async () => {
        await scheduleRecordingPage.selectDateFromToday();
        await scheduleRecordingPage.selectWitnessFromDropDown(caseDetails.witnessNames[0]);
        await scheduleRecordingPage.selectAllDefendantsFromDropDown();
        await scheduleRecordingPage.$interactive.saveButton.click();
        await expect(
          scheduleRecordingPage.iFrame.locator('[data-control-name="bookingScrn_BookingsGallery_Gal"] [data-control-part="gallery-item"]'),
        ).toBeVisible();
      });

      await test.step('Verify user is able to begin recording by obtaining rtmps link', async () => {
        await navBarComponent.$interactive.HomeButton.click();
        await homePage.verifyUserIsOnHomePage();
        await homePage.$interactive.manageBookingsButton.click();
        await manageBookingsPage.verifyUserIsOnManageBookingsPage();
        await manageBookingsPage.searchForABooking(caseDetails.caseReference);
        await manageBookingsPage.$interactive.recordButton.click();
        await viewLiveFeedPage.verifyUserIsOnViewLiveFeedPage();
        rtmpsLink = await viewLiveFeedPage.startRecordingAndCaptureRtmpsLink();
      });

      await test.step('Verify user is able to configure a cvp room with rtmps link', async () => {
        await cvp_SignInPage.page.bringToFront();
        await cvp_SignInPage.goTo();
        await cvp_SignInPage.verifyUserIsOnCvpSignInPage();
        await cvp_SignInPage.signIn(config.cvpUser.username, config.cvpUser.password);

        await cvp_RoomSettingsPage.verifyUserIsOnCvpRoomSettingsPage();
        await cvp_RoomSettingsPage.selectRoomFromDropdown('PRE009');
        hostPin = await cvp_RoomSettingsPage.editRoomSettings(rtmpsLink);
      });

      await test.step('Verify user is able to connect to the conference using the host pin', async () => {
        await cvp_ConferencePage.page.bringToFront();
        await cvp_ConferencePage.goTo();
        await cvp_ConferencePage.verifyUserIsOnCvpConferencePage();
        await cvp_ConferencePage.connectToConference(config.cvpUser.cvpConferenceUser, caseDetails.witnessNames[0]);

        await cvp_SelectRolePage.verifyUserIsOnCvpSelectRolePage();
        await cvp_SelectRolePage.connectAsHost(hostPin);
        await cvp_RecordingCallPage.verifyUserIsOnCvpRecordingCallPage();
      });

      await test.step('Verify user begins recording in cvp and live feed received in power app', async () => {
        await cvp_RoomSettingsPage.page.bringToFront();
        await cvp_RoomSettingsPage.beginRecording(config.cvpUser.serviceId, config.cvpUser.locationCode, caseDetails.caseReference);
        await viewLiveFeedPage.page.bringToFront();

        try {
          await networkInterceptUtils.interceptNetworkRequestToVerifyRecordingIsTakingPlace(caseDetails.caseReference, 90000);
        } catch (error) {
          await cvp_RoomSettingsPage.page.bringToFront();
          await cvp_RoomSettingsPage.$interactive.endCallButton.click();
          throw new Error(`Live feed for recording failed to start for case reference: ${caseDetails.caseReference}. Error: ${error}`);
        }
      });

      await test.step('Verify user is disconected from call once call has been ended in cvp', async () => {
        await cvp_RoomSettingsPage.page.bringToFront();
        await cvp_RoomSettingsPage.$interactive.endCallButton.click();
        await expect(cvp_RoomSettingsPage.$interactive.recordButton).toBeVisible();

        await cvp_RecordingCallPage.page.bringToFront();
        await cvp_RecordingCallPage.verifyUserHasBeenDisconnectedFromCall();
        await cvp_ConferencePage.verifyUserIsOnCvpConferencePage();
      });

      await test.step('Verify recording is processed in power app once user has clicked finish', async () => {
        await viewLiveFeedPage.page.bringToFront();
        await viewLiveFeedPage.finishRecording();
        await processingRecordingsPage.verifyUserIsOnProcessingRecordingsPage();
        await processingRecordingsPage.verifyRecordingIsProcessed(caseDetails.caseReference);
        await apiClient.verifyRecordingHasBeenSuccessfullyProcessedForCase(caseDetails.caseReference);
      });

      await test.step('Verify recording is now available in view recordings page', async () => {
        await navBarComponent.$interactive.HomeButton.click();
        await homePage.verifyUserIsOnHomePage();
        await homePage.$interactive.viewRecordingsButton.click();
        await viewRecordingsPage.verifyUserIsOnViewRecordingsPage();
        await viewRecordingsPage.searchForCaseReference(caseDetails.caseReference);
      });
    },
  );
});
