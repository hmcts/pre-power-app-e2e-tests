import { test as teardown } from '@playwright/test';

teardown.describe('teardown steps', () => {
  // This file is used to define global teardown steps for Playwright tests.
  teardown('teardown case data', async ({}) => {
    console.log('executing teardown steps');
  });
});
