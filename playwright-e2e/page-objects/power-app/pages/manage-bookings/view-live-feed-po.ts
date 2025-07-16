import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../../base';

export class ViewLiveFeedPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    startRecordingButton: this.iFrame.getByRole('button', { name: 'Start Recording' }),
    finishRecordingButton: this.iFrame.getByRole('button', { name: 'Finish' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    pageHeading: this.iFrame.locator('[data-control-name*="HeaderText"]').filter({ hasText: 'Livestream Viewer' }),
  } as const satisfies Record<string, Locator>;

  public readonly $startRecordingModal = {
    recordingLinkIsBeingGeneratedText: this.iFrame.getByText('A link will be generated.'),
    recordingLinkGeneratedText: this.iFrame.getByText('We are now ready to Record.'),
    generatedRtmpsLink: this.iFrame.locator('[data-control-name*="CVPRTMPUrlTxt"] textarea'),
    okButton: this.iFrame.getByRole('button', { name: 'Ok', exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $finishRecordingModal = {
    finishRecordingText: this.iFrame.getByText('Are you sure you want to finish the recording?'),
    yesButton: this.iFrame.getByRole('button', { name: 'Yes' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnViewLiveFeedPage(): Promise<void> {
    await expect(this.$static.pageHeading).toBeVisible();
  }

  /**
   * Starts the recording by clicking the "Start Recording" button, waits for the RTMPS link modal to appear,
   * verifies the link is generated, captures the RTMPS link value, and closes the modal.
   * Throws an error if the RTMPS link is empty.
   * @returns The generated RTMPS link as a trimmed string.
   */
  public async startRecordingAndCaptureRtmpsLink(): Promise<string> {
    await this.$interactive.startRecordingButton.click();
    await expect(this.iFrame.locator('[data-control-name="RTMPSWindow"]')).toBeVisible();
    await expect(this.$startRecordingModal.recordingLinkIsBeingGeneratedText).toBeVisible();
    await expect(this.$startRecordingModal.recordingLinkGeneratedText).toBeVisible({ timeout: 60000 });
    await expect(this.$startRecordingModal.generatedRtmpsLink).toBeVisible();

    const rtmpsLinkValue = await this.$startRecordingModal.generatedRtmpsLink.inputValue();
    if (!rtmpsLinkValue) {
      throw new Error('RTMPS link is empty');
    }

    await this.$startRecordingModal.okButton.click();
    await expect(this.iFrame.locator('[data-control-name*="CVPPrompt"]').first()).toBeHidden();
    return rtmpsLinkValue.trim();
  }

  /**
   * Finishes the recording by clicking the "Finish" button,
   * confirming the action in the modal, and clicking "Yes" to complete.
   */
  public async finishRecording(): Promise<void> {
    await this.$interactive.finishRecordingButton.click();
    await expect(this.$finishRecordingModal.finishRecordingText).toBeVisible();
    await this.$finishRecordingModal.yesButton.click();
  }
}
