import { test, expect } from '../../../fixtures';
import { BaseCaseDetails } from '../../../types';
import { config } from '../../../utils';

test.describe('Set of tests to verify functionality of case details page as a Level 1 user', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeEach(async ({ navigateToCaseDetailsPage }) => {
    await navigateToCaseDetailsPage();
  });

  test(
    'Verify user is able to open a new case and is redirected to the schedule recordings page',
    {
      tag: '@Regression',
    },
    async ({ caseDetailsPage, dataUtils, scheduleRecordingPage }) => {
      const caseDetails: BaseCaseDetails = dataUtils.generateRandomCaseDetails(2, 2);

      await caseDetailsPage.populateCaseDetails({
        caseReference: caseDetails.caseReference,
        defendantNames: caseDetails.defendantNames,
        witnessNames: caseDetails.witnessNames,
      });

      await caseDetailsPage.$interactive.saveButton.click();
      await expect(caseDetailsPage.$static.saveCaseSuccessLogo).toBeVisible();
      await expect(caseDetailsPage.$static.saveCaseSuccessText).toBeVisible();
      await scheduleRecordingPage.verifyUserIsOnScheduleRecordingsPage();
    },
  );

  test(
    'Verify case details are correct when searching and selecting an exisiting case',
    {
      tag: '@Regression',
    },
    async ({ caseDetailsPage, apiClient }) => {
      await test.step('Pre-requisite step in order to create a case via api', async () => {
        await apiClient.createCase(2, 2);
      });
      const caseData = await apiClient.getCaseData();

      await test.step('Verify case appears in searchlist when searched for', async () => {
        await caseDetailsPage.$inputs.caseReference.fill(caseData.caseReference);
        await expect(caseDetailsPage.$inputs.caseReference).toHaveValue(caseData.caseReference);

        await expect(caseDetailsPage.$static.searchResultExistingCasesTitle).toBeVisible();
        await expect(caseDetailsPage.$interactive.exsitingCaseFoundButtonInSearchList).toHaveCount(1);
        await expect(caseDetailsPage.$interactive.exsitingCaseFoundButtonInSearchList).toContainText(caseData.caseReference);
        await expect(caseDetailsPage.$interactive.exsitingCaseFoundButtonInSearchList).toContainText('Open');
        await expect(caseDetailsPage.$interactive.exsitingCaseFoundButtonInSearchList).toContainText('PRE');
        await expect(caseDetailsPage.$interactive.exsitingCaseFoundButtonInSearchList).toBeVisible();
      });

      await test.step('Verfiy test deatils are correct when exisiting case is selected from search list', async () => {
        await caseDetailsPage.$interactive.exsitingCaseFoundButtonInSearchList.click();
        await expect(caseDetailsPage.$static.selectedExistingCaseReferenceLable).toContainText(caseData.caseReference);
        await expect(caseDetailsPage.$static.selectedExistingCaseReferenceLable).toBeVisible();

        //Verify source lable contains PRE .
        await expect(caseDetailsPage.$static.selectedExisitingCaseSourceLable).toContainText('PRE');
        await expect(caseDetailsPage.$static.selectedExisitingCaseSourceLable).toBeVisible();

        //Verify case status is Active.
        await expect(caseDetailsPage.$static.selectedExisitingCaseStatusLable).toContainText('Active');
        await expect(caseDetailsPage.$static.selectedExisitingCaseStatusLable).toBeVisible();

        //Verify defendant value appears correctly.
        const defendantValue = await caseDetailsPage.$inputs.defendants.inputValue();
        for (const defendantName of caseData.defendantNames) {
          expect(defendantValue).toContain(defendantName);
        }
        await expect(caseDetailsPage.$inputs.defendants).toBeVisible();

        //Verify witness value appears correctly.
        const witnessValue = await caseDetailsPage.$inputs.witnesses.inputValue();
        for (const witnessName of caseData.witnessNames) {
          expect(witnessValue).toContain(witnessName);
        }
        await expect(caseDetailsPage.$inputs.witnesses).toBeVisible();
      });
    },
  );
});
