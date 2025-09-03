import { CommonConfig, ProjectsConfig } from '@hmcts/playwright-common';
import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './playwright-e2e',
  snapshotDir: './playwright-e2e/snapshots',
  ...CommonConfig.recommended,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  retries: 0,
  timeout: 120_000,
    expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
    },
  },
  projects: [
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'teardown',
      testMatch: /global\.teardown\.ts/,
    },
    {
      ...ProjectsConfig.chromium,
      dependencies: ['setup'],
      use: {
        ...ProjectsConfig.chromium.use,
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
        actionTimeout: 10_000,
        launchOptions: {
          args: [
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
          ],
        }, 
      },
    },
  ],
});
