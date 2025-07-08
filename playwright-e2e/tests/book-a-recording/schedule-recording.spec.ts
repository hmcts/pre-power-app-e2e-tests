import { test, expect } from '../../fixtures';
import { config } from '../../utils';
import { CaseDetailsType } from '../../page-objects/pages';

test.describe('Set of tests to verify schedule a recording page for Level 1 user', () => {
  test.use({ storageState: config.users.preUser.sessionFile });
  let caseData: CaseDetailsType;

  test.beforeEach(async ({ homePage, caseDetailsPage, scheduleRecordingPage, createNewCaseApi, config }) => {
    const user = config.users.preUser;
    caseData = await createNewCaseApi.request(user.userId, user.defaultCourtId, 2, 2);

    await homePage.goTo();
    await homePage.verifyUserIsOnHomePage();
    await homePage.$interactive.bookARecordingButton.click();
    await caseDetailsPage.verifyUserIsOnCaseDetailsPage();
    await caseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);
    await caseDetailsPage.$interactive.bookingsButton.click();
    await scheduleRecordingPage.verifyUserIsOnScheduleRecordingsPage();
  });

  test(
    'Verify user is able to book a recording for an existing case',
    {
      tag: '@smoke',
    },
    async ({ scheduleRecordingPage }) => {
      let dateSelected: string;

      await test.step('Verify user is able to schedule a recording', async () => {
        dateSelected = await scheduleRecordingPage.selectDateFromToday();
        await scheduleRecordingPage.selectWitnessFromDropDown(caseData.witnesses[0]);
        await scheduleRecordingPage.selectAllDefendantsFromDropDown();
        await scheduleRecordingPage.$interactive.saveButton.click();
        await expect(scheduleRecordingPage.$static.saveCaseSuccessLogo).toBeVisible();
        await expect(scheduleRecordingPage.$static.saveCaseSuccessText).toBeVisible();
      });

      await test.step('Verify correct details for case have been saved', async () => {
        await expect(scheduleRecordingPage.iFrame.getByText(`Recording Start: ${dateSelected}`)).toBeVisible();
        await expect(scheduleRecordingPage.iFrame.getByText(`Witness Name: ${caseData.witnesses[0]}`)).toBeVisible();
        for (const defendant of caseData.defendants) {
          await expect(scheduleRecordingPage.iFrame.getByText('Defendants: ')).toContainText(defendant);
        }
      });
    },
  );
});
