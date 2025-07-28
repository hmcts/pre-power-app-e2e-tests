import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';

test.describe('Set of tests to verify functionality of schedule a recording page for Level 1 user', () => {
  const user = config.powerAppUsers.preLevel1User;
  test.use({ storageState: user.sessionFile });

  test.beforeEach(async ({ navigateToScheduleRecordingsPage, apiClient }) => {
    const caseData = await apiClient.createCase(2, 2);
    await navigateToScheduleRecordingsPage(caseData.caseReference);
  });

  test(
    'Verify user is able to book a recording for an existing case',
    {
      tag: '@Regression',
    },
    async ({ scheduleRecordingPage, apiClient }) => {
      const caseData = await apiClient.getCaseData();
      let dateSelected: string;

      await test.step('Verify user is able to schedule a recording', async () => {
        dateSelected = await scheduleRecordingPage.selectDateFromToday();
        await scheduleRecordingPage.selectWitnessFromDropDown(caseData.witnessNames[0]);
        await scheduleRecordingPage.selectAllDefendantsFromDropDown();
        await scheduleRecordingPage.$interactive.saveButton.click();
        await expect(scheduleRecordingPage.$static.saveCaseSuccessLogo).toBeVisible();
        await expect(scheduleRecordingPage.$static.saveCaseSuccessText).toBeVisible();
      });

      await test.step('Verify correct details for case have been saved', async () => {
        await expect(scheduleRecordingPage.iFrame.getByText(`Recording Start: ${dateSelected}`)).toBeVisible();
        await expect(scheduleRecordingPage.iFrame.getByText(`Witness Name: ${caseData.witnessNames[0]}`)).toBeVisible();
        for (const defendant of caseData.defendantNames) {
          await expect(scheduleRecordingPage.iFrame.getByText('Defendants: ')).toContainText(defendant);
        }
      });
    },
  );
});
