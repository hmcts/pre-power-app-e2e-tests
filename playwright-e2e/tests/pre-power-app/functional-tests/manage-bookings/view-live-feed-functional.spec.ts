import { test, expect } from '../../../../fixtures';
import { config } from '../../../../utils';

test.describe('Set of tests to verify functionality of view live feed page for Level 1 user', () => {
  const user = config.powerAppUsers.preLevel1User;
  test.use({ storageState: user.sessionFile });

  test.beforeEach(async ({ navigateToPowerAppViewLiveFeedPage, apiClient }) => {
    const bookingData = await apiClient.createBooking(2, 2, 'today');
    await navigateToPowerAppViewLiveFeedPage(bookingData.caseReference);
  });

  test(
    'Verify correct recording details are displayed when user selects show link button',
    {
      tag: ['@regression', '@functional'],
    },
    async ({ powerApp_ViewLiveFeedPage }) => {
      await test.step('Given user has selected option to start a recording', async () => {
        await powerApp_ViewLiveFeedPage.selectStartRecordingButton();
        await expect(powerApp_ViewLiveFeedPage.$startRecordingModal.recordingLinkGeneratedText).toBeVisible({ timeout: 90000 });
        await powerApp_ViewLiveFeedPage.selectOkButtonToDismissStartRecordingModal();
      });

      await test.step('When user selects the show link button', async () => {
        await powerApp_ViewLiveFeedPage.$interactive.showLinkButton.click();
      });

      await test.step('The correct details are displayed on modal', async () => {
        await expect(powerApp_ViewLiveFeedPage.$startRecordingModal.recordingLinkGeneratedText).toBeVisible();
        await expect(powerApp_ViewLiveFeedPage.$startRecordingModal.recordingLinkGeneratedText).toHaveValue(
          'We are now ready to Record. \n\nPlease open CVP and copy the link below:',
        );

        const rtmpsLinkValue = await powerApp_ViewLiveFeedPage.$startRecordingModal.generatedRtmpsLink.inputValue();
        await expect(powerApp_ViewLiveFeedPage.$startRecordingModal.generatedRtmpsLink).toBeVisible();
        expect(rtmpsLinkValue).toContain('rtmps://');

        await expect(powerApp_ViewLiveFeedPage.$startRecordingModal.dontForgetToStartRecordingText).toBeVisible();
        await expect(powerApp_ViewLiveFeedPage.$startRecordingModal.dontForgetToStartRecordingText).toHaveText("Don't forget to press Record...");

        await expect(powerApp_ViewLiveFeedPage.$startRecordingModal.okButton).toBeVisible();
        await expect(powerApp_ViewLiveFeedPage.$startRecordingModal.okButton).toHaveText('Ok');
      });
    },
  );
});
