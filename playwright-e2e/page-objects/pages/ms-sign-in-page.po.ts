import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../base';
import { config } from '../../utils';

export class MsSignInPage extends Base {
  public readonly $emailInput: Locator = this.page.getByRole('textbox', {
    name: 'Enter your email',
  });
  public readonly $nextButton: Locator = this.page.getByRole('button', { name: 'Next' });
  public readonly $passwordInput: Locator = this.page.getByRole('textbox', {
    name: 'Enter the password',
  });
  public readonly $signInButton: Locator = this.page.getByRole('button', { name: 'Sign in' });
  public $staySignedInButton(optionToSelect: 'Yes' | 'No'): Locator {
    return this.page.getByRole('button', { name: optionToSelect });
  }

  constructor(page: Page) {
    super(page);
  }
  /**
   * Signs in to the Microsoft account using the provided email and password.
   * @param email - The email address to sign in with.
   * @param password - The password for the account.
   */
  public async signIn(email: string, password: string): Promise<void> {
    await this.page.goto(config.urls.powerAppUrl);

    await expect(this.page.getByRole('img', { name: 'Microsoft' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await this.$emailInput.fill(email);
    await expect(this.$nextButton).toBeVisible();
    await this.$nextButton.click();

    await expect(this.page.getByRole('heading', { name: 'Enter password' })).toBeVisible();
    await this.$passwordInput.fill(password);
    await expect(this.$signInButton).toBeVisible();
    await this.$signInButton.click();

    await expect(this.page.getByRole('heading', { name: 'Stay signed in?' })).toBeVisible();
    await expect(this.$staySignedInButton('Yes')).toBeVisible();
    await this.$staySignedInButton('Yes').click();

    await expect.poll(() => this.page.url()).toContain('apps.powerapps.com/play/');
  }
}
