import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';

test.describe('Set of tests to verify functionality of view live feed page for Level 1 user', () => {
  const user = config.powerAppUsers.preLevel1User;
  test.use({ storageState: user.sessionFile });

  test.beforeEach(async ({ navigateToViewLiveFeedPage, apiClient }) => {
    const bookingData = await apiClient.createBooking(2, 2, 'today');
    await navigateToViewLiveFeedPage(bookingData.caseReference);
  });

  test(
    'Verify correct recording details are displayed when user selects show link button',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ viewLiveFeedPage }) => {
      await test.step('Given user has selected option to start a recording', async () => {
        await viewLiveFeedPage.selectStartRecordingButton();
        await expect(viewLiveFeedPage.$startRecordingModal.recordingLinkGeneratedText).toBeVisible({ timeout: 90000 });
        await viewLiveFeedPage.selectOkButtonToDismissStartRecordingModal();
      });

      await test.step('When user selects the show link button', async () => {
        await viewLiveFeedPage.$interactive.showLinkButton.click();
      });

      await test.step('The correct details are displayed on modal', async () => {
        await expect(viewLiveFeedPage.$startRecordingModal.recordingLinkGeneratedText).toBeVisible();
        await expect(viewLiveFeedPage.$startRecordingModal.recordingLinkGeneratedText).toHaveValue(
          'We are now ready to Record. \n\nPlease open CVP and copy the link below:',
        );

        const rtmpsLinkValue = await viewLiveFeedPage.$startRecordingModal.generatedRtmpsLink.inputValue();
        await expect(viewLiveFeedPage.$startRecordingModal.generatedRtmpsLink).toBeVisible();
        expect(rtmpsLinkValue).toContain('rtmps://');

        await expect(viewLiveFeedPage.$startRecordingModal.dontForgetToStartRecordingText).toBeVisible();
        await expect(viewLiveFeedPage.$startRecordingModal.dontForgetToStartRecordingText).toHaveText("Don't forget to press Record...");

        await expect(viewLiveFeedPage.$startRecordingModal.okButton).toBeVisible();
        await expect(viewLiveFeedPage.$startRecordingModal.okButton).toHaveText('Ok');
      });
    },
  );
});
