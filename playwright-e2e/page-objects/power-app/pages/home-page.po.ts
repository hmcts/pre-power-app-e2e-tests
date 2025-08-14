import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../base';
import { config } from '../../../utils';

export class HomePage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $interactive = {
    bookARecordingButton: this.iFrame.getByText('Book a Recording', { exact: true }),
    manageBookingsButton: this.iFrame.getByText('Manage Bookings', { exact: true }),
    viewRecordingsButton: this.iFrame.getByText('View Recordings', { exact: true }),
    adminButton: this.iFrame.getByText('Admin', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    heading: this.iFrame.getByRole('heading', { name: 'Pre-Recorded Evidence' }),
  } as const satisfies Record<string, Locator>;

  public readonly $maskedlocatorsForVisualTesting = {
    applicationVersion: this.iFrame.locator('[data-control-name="landingScrn_AppVersion_Txt"]'),
    welcomeTextForUser: this.iFrame.locator('[data-control-name="landingScrn_WelcomeText_Lbl"]'),
  } as const satisfies Record<string, Locator>;

  public async goTo(): Promise<void> {
    await this.page.goto(config.urls.powerAppUrl);
  }

  public async verifyUserIsOnHomePage(): Promise<void> {
    await expect(this.$static.heading).toBeVisible({ timeout: 60000 });
  }

  public async provideConsentToStreamingManagerIfPrompted(): Promise<void> {
    const consentIframe = this.page.frameLocator('[name="consentService-iFrame"]');
    const consentHeader = consentIframe.locator('h1').filter({ hasText: 'Allow Streaming Manager' });

    try {
      await this.page.locator('iframe[name="consentService-iFrame"]').waitFor({ state: 'attached', timeout: 1_000 });
    } catch {
      return;
    }

    await consentHeader.waitFor({ state: 'visible', timeout: 20_000 });
    await consentIframe.getByRole('button', { name: 'Allow', exact: true }).click();
    await expect(consentHeader).toBeHidden();
    await expect(this.$static.heading).toBeVisible({ timeout: 20_000 });
    await this.page.reload();
  }
}
