import { Page, Locator, expect } from '@playwright/test';

export class CvpRecordingCallPage {
  constructor(public readonly page: Page) {}

  public readonly $interactive = {
    participantsMenuButton: this.page.getByRole('button', { name: 'Control participants menu' }),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnCvpRecordingCallPage(): Promise<void> {
    await expect(this.$interactive.participantsMenuButton).toBeVisible();
  }

  /**
   * Verifies that the user has been disconnected from the call by checking for the
   * "You have been disconnected" heading and clicking the "OK" button to dismiss the dialog.
   */
  public async verifyUserHasBeenDisconnectedFromCall(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'You have been disconnected' })).toBeVisible();
    await this.page.getByRole('button', { name: 'OK' }).click();
  }
}
