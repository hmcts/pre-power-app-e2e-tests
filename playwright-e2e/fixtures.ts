import { test as baseTest } from '@playwright/test';
import getPort from 'get-port';
import { PageFixtures, pageFixtures } from './page-objects/page.fixtures';
import { UtilsFixtures, utilsFixtures } from './utils';
import { ApiFixtures, apiFixtures } from './api-requests/api.fixtures';
import { CreatedCaseSummary, RecordingDetails } from './types';

// Gather all fixture types into a common type
export type CustomFixtures = PageFixtures & UtilsFixtures & ApiFixtures;

// Extend 'test' object using custom fixtures
// Test scoped fixtures are the first template parameter
// Worker scoped fixtures are the second template
export const test = baseTest.extend<CustomFixtures, { lighthousePort: number }>({
  ...pageFixtures,
  ...utilsFixtures,
  ...apiFixtures,
  // Worker scoped fixtures need to be defined separately
  lighthousePort: [
    async ({}, use) => {
      const port = await getPort();
      await use(port);
    },
    { scope: 'worker' },
  ],
});

// The following afterEach hook is used to clean up cases created during tests
// It checks if a case was created via api and if it does not have an associated recording, it deletes it
test.afterEach('Delete cases created via api requests provided they do not have a recording associated with them', async ({ apiClient }) => {
  let caseData: CreatedCaseSummary | undefined;
  let recordingData: RecordingDetails | undefined;

  try {
    caseData = await apiClient.getCaseData();
    recordingData = await apiClient.getRecordingData();
  } catch {
    if (!recordingData && caseData) {
      await apiClient.deleteCaseByCaseId(caseData.caseId);
      console.log(`As part of after each step, Deleted case with ID: ${caseData.caseId} and reference: ${caseData.caseReference}`);
    }
  }
});

// If you were extending assertions, you would also import the "expect" property from this file
export const expect = test.expect;
