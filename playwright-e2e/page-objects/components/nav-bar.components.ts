import { Page, Locator } from '@playwright/test';
import { Base } from '../base';

export class NavBarComponent extends Base {
  public readonly $interactive = {
    HomeButton: this.iFrame.getByText('Home', { exact: true }),
  } as const satisfies Record<string, Locator>;

  constructor(page: Page) {
    super(page);
  }
}
