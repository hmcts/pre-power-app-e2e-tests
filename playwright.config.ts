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
      },
    },
  ],
});
