import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../base';
import { config } from '../../utils';

export class HomePage extends Base {
  public readonly $interactive = {
    bookARecordingButton: this.iFrame.getByText('Book a Recording', { exact: true }),
    manageBookingsButton: this.iFrame.getByText('Manage Bookings', { exact: true }),
    viewRecordingsButton: this.iFrame.getByText('View Recordings', { exact: true }),
    adminButton: this.iFrame.getByText('Admin', { exact: true }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    heading: this.iFrame.getByRole('heading', { name: 'Pre-Recorded Evidence' }),
  } as const satisfies Record<string, Locator>;

  constructor(page: Page) {
    super(page);
  }

  public async goTo(): Promise<void> {
    await this.page.goto(config.urls.powerAppUrl);
  }

  public async verifyUserIsOnHomePage(): Promise<void> {
    await expect(this.$static.heading).toBeVisible({ timeout: 60000 });
  }
}
