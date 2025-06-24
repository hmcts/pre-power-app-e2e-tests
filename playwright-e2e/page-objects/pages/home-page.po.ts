import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../base';
import { config } from '../../utils';

export class HomePage extends Base {
  public readonly $bookARecordingButton: Locator = this.iFrame.getByText('Book a Recording', {
    exact: true,
  });
  public readonly $manageBookingsButton: Locator = this.iFrame.getByText('Manage Bookings', {
    exact: true,
  });
  public readonly $viewRecordingsButton: Locator = this.iFrame.getByText('View Recordings', {
    exact: true,
  });
  public readonly $adminButton: Locator = this.iFrame.getByText('Admin', { exact: true });

  constructor(page: Page) {
    super(page);
  }

  public async goTo(): Promise<void> {
    await this.page.goto(config.urls.powerAppUrl);
  }
  public async verifyHeadingIsVisible(): Promise<void> {
    await expect(this.iFrame.getByRole('heading', { name: 'Pre-Recorded Evidence' })).toBeVisible({
      timeout: 60000,
    });
  }
}
