import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';

test.describe('Set of tests to verify functionality of view recordings page for Level 1 user', () => {
  const user = config.powerAppUsers.preLevel1User;
  test.use({ storageState: user.sessionFile });

  test.beforeEach(async ({ navigateToViewRecordingsPage, apiClient }) => {
    await apiClient.createANewCaseAndAssignRecording(2, 2);
    await navigateToViewRecordingsPage();
  });

  test(
    'Verify user is able to search for a case and confirm the list search details are correct',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ apiClient, viewRecordingsPage }) => {
      const bookingData = await apiClient.getBookingData();
      const recordingData = await apiClient.getRecordingData();

      await test.step('Verify recording can be found in view recordings page', async () => {
        await viewRecordingsPage.searchForCaseReference(bookingData.caseReference);
      });

      await test.step('Verify case and recording details are correct in search list', async () => {
        await expect(viewRecordingsPage.$static.caseReferenceLabelInSearchList).toHaveText(`Case Reference: ${bookingData.caseReference}`);
        await expect(viewRecordingsPage.$static.recordingVersionLabelInSearchList).toHaveText('V.1');
        await expect(viewRecordingsPage.$static.courtLabelInSearchList).toContainText('Court:');
        await expect(viewRecordingsPage.$static.recordingIdLabelInSearchList).toHaveText(`Recording UID: ${recordingData.recordingId}`);
        await expect(viewRecordingsPage.$static.WitnessLabelInSearchList).toHaveText(`Witness: ${bookingData.witnessSelectedForCaseRecording}`);
        for (const defendantName of bookingData.defendantNames) {
          await expect(viewRecordingsPage.$static.defendantLabelInSearchList.filter({ hasText: 'Defendants:' })).toContainText(defendantName);
        }
        await expect(viewRecordingsPage.$static.recordingDateLabelInSearchList).toHaveText(
          `Recording Date: ${recordingData.recordingDate} ${recordingData.recordingTime}`,
        );
        await expect(viewRecordingsPage.$static.recordingSourceLabelInSearchList).toHaveText('Source: PRE');
        await expect(viewRecordingsPage.$static.recordingDurationLabelInSearchList).toHaveText(`Duration: ${recordingData.recordingDuration}`);
        await expect(viewRecordingsPage.$static.StatusLabelInSearchList).toHaveText('Status: ');
        await expect(viewRecordingsPage.$static.caseStatusLabelInSearchList).toHaveText('Active');
      });
    },
  );

  test(
    'Verify user is able to view a recording for an existing case',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ apiClient, viewRecordingsPage, networkInterceptUtils }) => {
      const caseData = await apiClient.getCaseData();

      await test.step('Search and select an existing recording', async () => {
        await viewRecordingsPage.searchForCaseReference(caseData.caseReference);
        await viewRecordingsPage.$interactive.viewRecordingButton.click();
      });

      await test.step('Select option to confirm playback of recordings is actively monitored', async () => {
        await expect(viewRecordingsPage.$recordingsMonitoredAndAuditedModal.modalWindow).toBeVisible();
        await viewRecordingsPage.$recordingsMonitoredAndAuditedModal.confirmButton.click();
        await expect(viewRecordingsPage.$static.videoPlaybackText).toHaveText('Media selection loading,Please wait.');
      });

      await test.step('Verify video and audio stream is received from media kind via network requests', async () => {
        await networkInterceptUtils.interceptNetworkRequestToVerifyVideoStreamIsReceivedFromMediaKind(60_000);
        await networkInterceptUtils.interceptNetworkRequestToVerifyAudioStreamIsReceivedFromMediaKind(15_000);
        await networkInterceptUtils.interceptNetworkRequestToVerifyClearKeyRequestIsSuccessful(15_000);
      });

      await test.step('Verify user is able to play back the recording', async () => {
        await expect(viewRecordingsPage.$interactive.playVideoButton).toBeVisible({ timeout: 15_000 });
        await viewRecordingsPage.$interactive.playVideoButton.click();
        await expect(viewRecordingsPage.$interactive.playVideoButton).toBeHidden();
        await expect(viewRecordingsPage.$interactive.pauseVideoButton).toBeVisible();
      });
    },
  );
});
