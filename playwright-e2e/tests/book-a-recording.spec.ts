/* eslint-disable playwright/no-skipped-test */
import { test, expect } from '../fixtures';
import { config } from '../utils';
import { CaseDetailsType } from '../page-objects/pages';

test.describe('Set of tests to verify book a recording flow and UI', () => {
  test.use({ storageState: config.users.preUser.sessionFile });

  test.beforeEach(async ({ homePage, caseDetailsPage }) => {
    await homePage.goTo();
    await homePage.verifyUserIsOnHomePage();
    await homePage.$interactive.bookARecordingButton.click();
    await caseDetailsPage.verifyUserIsOnCaseDetailsPage();
  });

  test(
    'Verify user is able to book a recording via UI',
    {
      tag: '@smoke',
    },
    async ({ caseDetailsPage, dataUtils, scheduleRecordingPage }) => {
      const caseDetails: CaseDetailsType = dataUtils.generateRandomCaseDetails(2, 2);
      let dateSelected: string;

      await test.step('Verify user is able to open a new case', async () => {
        await caseDetailsPage.populateCaseDetails({
          caseReference: caseDetails.caseReference,
          defendants: caseDetails.defendants,
          witnesses: caseDetails.witnesses,
        });
        await caseDetailsPage.$interactive.saveButton.click();
        await expect(caseDetailsPage.$static.saveCaseSuccessLogo).toBeVisible();
        await expect(caseDetailsPage.$static.saveCaseSuccessText).toBeVisible();
      });

      await test.step('Verify user is able to schedule a recording', async () => {
        await scheduleRecordingPage.verifyUserIsOnScheduleRecordingsPage();
        dateSelected = await scheduleRecordingPage.selectDateFromToday();
        await scheduleRecordingPage.selectWitnessFromDropDown(caseDetails.witnesses[0]);
        await scheduleRecordingPage.selectAllDefendantsFromDropDown();
        await scheduleRecordingPage.$interactive.saveButton.click();
        await expect(scheduleRecordingPage.$static.saveCaseSuccessLogo).toBeVisible();
        await expect(scheduleRecordingPage.$static.saveCaseSuccessText).toBeVisible();
      });

      await test.step('Verify correct details for case have been saved', async () => {
        await expect(scheduleRecordingPage.iFrame.getByText(`Recording Start: ${dateSelected}`)).toBeVisible();
        await expect(scheduleRecordingPage.iFrame.getByText(`Witness Name: ${caseDetails.witnesses[0]}`)).toBeVisible();
        for (const defendant of caseDetails.defendants) {
          await expect(scheduleRecordingPage.iFrame.getByText('Defendants: ')).toContainText(defendant);
        }
      });
    },
  );
});
