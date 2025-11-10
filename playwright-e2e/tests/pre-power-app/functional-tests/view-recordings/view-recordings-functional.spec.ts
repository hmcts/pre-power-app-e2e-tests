import { test, expect } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify functionality of view recordings page for Level 1 user', () => {
  const user = config.powerAppUsers.preLevel1User;
  test.use({ storageState: user.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppViewRecordingsPage, apiClient }) => {
    await apiClient.createANewCaseAndAssignRecording(2, 2, 'today');
    await navigateToPowerAppViewRecordingsPage();
  });

  test(
    'Verify user is able to search for a case and confirm the list search details are correct',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ apiClient, powerApp_ViewRecordingsPage }) => {
      const caseData = await apiClient.getCaseData();

      await test.step('Verify recording can be found in view recordings page', async () => {
        await powerApp_ViewRecordingsPage.searchForCaseReference(caseData.caseReference, 'recordingAssignedByApi');
      });

      await test.step('Verify case and recording details are correct in search list', async () => {
        const bookingData = await apiClient.getBookingData();
        const recordingData = await apiClient.getRecordingData();

        await expect(powerApp_ViewRecordingsPage.$static.caseReferenceLabelInSearchList).toHaveText(`Case Reference: ${caseData.caseReference}`);
        await expect(powerApp_ViewRecordingsPage.$static.recordingVersionLabelInSearchList).toHaveText('V.1');
        await expect(powerApp_ViewRecordingsPage.$static.courtLabelInSearchList).toContainText('Court:');
        await expect(powerApp_ViewRecordingsPage.$static.recordingIdLabelInSearchList).toHaveText(`Recording UID: ${recordingData.recordingId}`);
        await expect(powerApp_ViewRecordingsPage.$static.WitnessLabelInSearchList).toHaveText(
          `Witness: ${bookingData.witnessSelectedForCaseRecording}`,
        );
        for (const defendantName of caseData.defendantNames) {
          await expect(powerApp_ViewRecordingsPage.$static.defendantLabelInSearchList.filter({ hasText: 'Defendants:' })).toContainText(
            defendantName,
          );
        }
        await expect(powerApp_ViewRecordingsPage.$static.recordingDateLabelInSearchList).toHaveText(
          `Recording Date: ${recordingData.recordingDate} ${recordingData.recordingTime}`,
        );
        await expect(powerApp_ViewRecordingsPage.$static.recordingSourceLabelInSearchList).toHaveText('Source: PRE');
        await expect(powerApp_ViewRecordingsPage.$static.recordingDurationLabelInSearchList).toHaveText(
          `Duration: ${recordingData.recordingDuration}`,
        );
        await expect(powerApp_ViewRecordingsPage.$static.StatusLabelInSearchList).toHaveText('Status: ');
        await expect(powerApp_ViewRecordingsPage.$static.caseStatusLabelInSearchList).toHaveText('Active');
      });
    },
  );

  test(
    'Verify user is able to view a recording for an existing case',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ apiClient, powerApp_ViewRecordingsPage, networkInterceptUtils }) => {
      const caseData = await apiClient.getCaseData();

      await test.step('Search and select an existing recording', async () => {
        await powerApp_ViewRecordingsPage.searchForCaseReference(caseData.caseReference, 'recordingAssignedByApi');
        await powerApp_ViewRecordingsPage.$interactive.viewRecordingButton.click();
      });

      await test.step('Select option to confirm playback of recordings is actively monitored', async () => {
        await expect(powerApp_ViewRecordingsPage.$recordingsMonitoredAndAuditedModal.modalWindow).toBeVisible();
        await powerApp_ViewRecordingsPage.$recordingsMonitoredAndAuditedModal.confirmButton.click();
        await expect(powerApp_ViewRecordingsPage.$static.videoPlaybackText).toHaveText('Media selection loading,Please wait.');
      });

      await test.step('Verify video and audio stream is received from media kind via network requests', async () => {
        await networkInterceptUtils.interceptNetworkRequestToVerifyVideoStreamIsReceivedFromMediaKind(60_000);
        await networkInterceptUtils.interceptNetworkRequestToVerifyAudioStreamIsReceivedFromMediaKind(15_000);
        await networkInterceptUtils.interceptNetworkRequestToVerifyClearKeyRequestIsSuccessful(15_000);
      });

      await test.step('Verify user is able to play back the recording', async () => {
        await expect(powerApp_ViewRecordingsPage.$interactive.playVideoButton).toBeVisible({ timeout: 15_000 });
        await powerApp_ViewRecordingsPage.$interactive.playVideoButton.click();
        await expect(powerApp_ViewRecordingsPage.$interactive.playVideoButton).toBeHidden();
        await expect(powerApp_ViewRecordingsPage.$interactive.pauseVideoButton).toBeVisible();
      });
    },
  );
});
