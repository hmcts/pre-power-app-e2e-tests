import { Page, FrameLocator, Locator } from '@playwright/test';

// A base page inherited by pages & components
// can contain any additional config needed + instantiated page object
export abstract class Base {
  public readonly iFrame: FrameLocator = this.page.frameLocator('#fullscreen-app-host');
  constructor(public readonly page: Page) {}

  public readonly $globalMaskedLocatersForVisualTesting = {
    powerAppsHeaderContainer: this.page.locator('[id*="HeaderContainer"]'),
    applicationCourtTitle: this.iFrame.locator('[data-control-name="HeaderCourtTitle"]'),
    applicationEnvironment: this.iFrame.locator('[data-control-name="HeaderEnvLabel"]'),
  } as const satisfies Record<string, Locator>;
}
