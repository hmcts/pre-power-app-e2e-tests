import { Page, FrameLocator } from '@playwright/test';

// A base page inherited by pages & components
// can contain any additional config needed + instantiated page object
export abstract class Base {
  public readonly iFrame: FrameLocator = this.page.frameLocator('#fullscreen-app-host');
  constructor(public readonly page: Page) {}
}
