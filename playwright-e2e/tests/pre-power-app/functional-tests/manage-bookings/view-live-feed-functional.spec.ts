import { test, expect } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify functionality of view live feed page for Level 1 user', () => {
  const user = config.powerAppUsers.preLevel1User;
  test.use({ storageState: user.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppViewLiveFeedPage, apiClient }) => {
    await apiClient.createNewCaseAndScheduleABooking(2, 2, 'today');
    const caseData = await apiClient.getCaseData();
    await navigateToPowerAppViewLiveFeedPage(caseData.caseReference);
  });

  test(
    'Verify correct recording details are displayed when user selects show link button',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ powerAppPages }) => {
      await test.step('Given user has selected option to start a recording', async () => {
        await powerAppPages.viewLiveFeedPage.selectStartRecordingButton();
        await expect(powerAppPages.viewLiveFeedPage.$startRecordingModal.recordingLinkIsBeingGeneratedSpinner).toBeHidden({ timeout: 90000 });
        await expect(powerAppPages.viewLiveFeedPage.$startRecordingModal.generatedRtmpsLink).toBeVisible({ timeout: 30000 });
        await powerAppPages.viewLiveFeedPage.selectCloseButtonToDismissStartRecordingModal();
      });

      await test.step('When user selects the show link button', async () => {
        await powerAppPages.viewLiveFeedPage.$interactive.showLinkButton.click();
      });

      await test.step('The correct details are displayed on modal', async () => {
        await expect(powerAppPages.viewLiveFeedPage.$startRecordingModal.generatedRtmpsLink).toBeVisible();
        const rtmpsLinkValue = await powerAppPages.viewLiveFeedPage.$startRecordingModal.generatedRtmpsLink.inputValue();
        expect(rtmpsLinkValue).toContain('rtmps://');

        await expect(powerAppPages.viewLiveFeedPage.$startRecordingModal.copyLinkButton).toBeVisible();
        await expect(powerAppPages.viewLiveFeedPage.$startRecordingModal.recordingUriInstructionText).toBeVisible();
        await expect(powerAppPages.viewLiveFeedPage.$startRecordingModal.recordingUriInstructionText).toHaveText(
          'Paste this link into the "Recording URI" textbox in CVP - Edit Room Settings',
        );

        await expect(powerAppPages.viewLiveFeedPage.$startRecordingModal.closeButton).toBeVisible();
        await expect(powerAppPages.viewLiveFeedPage.$startRecordingModal.closeButton).toHaveText('Close');
      });
    },
  );
});
