import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../base';

export class PortalWatchRecordingPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    playRecordingButton: this.page.locator('button[aria-label="Play"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    heading: this.page.locator('h1[class*="govuk-heading"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnWatchRecordingPage(): Promise<void> {
    await expect.poll(() => this.page.url()).toContain('watch');
  }
}
