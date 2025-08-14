/* eslint-disable playwright/no-skipped-test */
import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';

test.describe('Set of tests to verify the schedule recording page UI is visually correct', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeAll(async ({ headless }) => {
    test.skip(!headless, 'Skipping visual tests in headed mode');
  });

  test(
    'Verify when accessing schedule recording page for an existing case that has no booking, it is visually correct',
    {
      tag: ['@regression', '@visual'],
    },
    async ({ page, scheduleRecordingPage, apiClient, navigateToScheduleRecordingsPage }) => {
      await test.step('Pre-requisite step in order to create a case and navigate to schedule recording page', async () => {
        const caseData = await apiClient.createCase(2, 2);
        await navigateToScheduleRecordingsPage(caseData.caseReference);
      });
      const maskedElements = [
        scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
      ];

      await test.step('Verify upon accessing schedule recording page, it is visually correct', async () => {
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(async () => {
          await expect(page).toHaveScreenshot('schedule-recordings-page-no-booking-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify when accessing schedule recording page for an existing case that has a booking, it is visually correct',
    {
      tag: ['@regression', '@visual'],
    },
    async ({ page, scheduleRecordingPage, apiClient, navigateToScheduleRecordingsPage, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to create a case and navigate to schedule recording page', async () => {
        const caseData = await apiClient.createBooking(2, 2, 'today');
        await navigateToScheduleRecordingsPage(caseData.caseReference);
      });
      const maskedElements = [
        scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
      ];

      await test.step('Redact dynamic test data', async () => {
        const caseData = await apiClient.getBookingData();

        await userInterfaceUtils.replaceTextWithinStaticElement(
          scheduleRecordingPage.$static.scheduledRecordingStartDateLabel.locator('[data-control-part="text"]'),
          [[/(\d{2}\/\d{2}\/\d{4})/, '01/01/0001']],
        );

        await userInterfaceUtils.replaceTextWithinStaticElement(
          scheduleRecordingPage.$static.scheduledRecordingWitnessLabel.locator('[data-control-part="text"]'),
          [[caseData.witnessSelectedForCaseRecording, '{redacted-witness}']],
        );

        for (const defendant of caseData.defendantNames) {
          await userInterfaceUtils.replaceTextWithinStaticElement(
            scheduleRecordingPage.$static.scheduledRecordingDefendantsLabel.locator('[data-control-part="text"]'),
            [[defendant, '{redacted-defendant}']],
          );
        }
      });

      await test.step('Verify upon accessing schedule recording page, it is visually correct', async () => {
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(async () => {
          await expect(page).toHaveScreenshot('schedule-recordings-page-has-booking-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify when attempting to delete a scheduled recording on scheduled recording page, it is visually correct',
    {
      tag: ['@regression', '@visual'],
    },
    async ({ page, scheduleRecordingPage, apiClient, navigateToScheduleRecordingsPage, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to create a case, navigate to schedule recording page', async () => {
        const caseData = await apiClient.createBooking(2, 2, 'today');
        await navigateToScheduleRecordingsPage(caseData.caseReference);
      });
      const maskedElements = [
        scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
      ];

      await test.step('Select option to delete scheduled recording', async () => {
        await scheduleRecordingPage.$interactive.deleteScheduledRecordingButton.click();
        await expect(scheduleRecordingPage.$deleteScheduleModal.modalWindow).toBeVisible();
      });

      await test.step('Redact dynamic test data', async () => {
        const caseData = await apiClient.getBookingData();

        await userInterfaceUtils.replaceTextWithinStaticElement(
          scheduleRecordingPage.$static.scheduledRecordingStartDateLabel.locator('[data-control-part="text"]'),
          [[/(\d{2}\/\d{2}\/\d{4})/, '01/01/0001']],
        );

        await userInterfaceUtils.replaceTextWithinStaticElement(
          scheduleRecordingPage.$deleteScheduleModal.modalBody.locator('[data-control-part="text"]'),
          [
            [caseData.caseReference, '{redacted}'],
            [/\b\d{2}\/\d{2}\/\d{4}\b/, '01/01/0001'],
            [caseData.witnessSelectedForCaseRecording, '{redacted-witness}'],
          ],
        );

        for (const defendant of caseData.defendantNames) {
          await userInterfaceUtils.replaceTextWithinStaticElement(
            scheduleRecordingPage.$deleteScheduleModal.modalBody.locator('[data-control-part="text"]'),
            [[defendant, '{redacted-defendant}']],
          );
        }
      });

      await test.step('Verify upon selecting option to delete a scheduled recording, it is visually correct', async () => {
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(async () => {
          await expect(page).toHaveScreenshot('schedule-recordings-page-delete-booking-modal-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify when viewing a booking that has a recording on scheduled recording page, it is visually correct',
    {
      tag: ['@regression', '@visual'],
    },
    async ({ page, scheduleRecordingPage, apiClient, navigateToScheduleRecordingsPage, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to create a case and navigate to schedule recording page', async () => {
        await apiClient.createANewCaseAndAssignRecording(2, 2);
        const caseData = await apiClient.getCaseData();
        await navigateToScheduleRecordingsPage(caseData.caseReference);
      });

      await test.step('Redact dynamic test data', async () => {
        const caseData = await apiClient.getBookingData();

        await userInterfaceUtils.replaceTextWithinStaticElement(
          scheduleRecordingPage.$static.scheduledRecordingStartDateLabel.locator('[data-control-part="text"]'),
          [[/(\d{2}\/\d{2}\/\d{4})/, '01/01/0001']],
        );

        await userInterfaceUtils.replaceTextWithinStaticElement(
          scheduleRecordingPage.$static.scheduledRecordingWitnessLabel.locator('[data-control-part="text"]'),
          [[caseData.witnessSelectedForCaseRecording, '{redacted-witness}']],
        );

        for (const defendant of caseData.defendantNames) {
          await userInterfaceUtils.replaceTextWithinStaticElement(
            scheduleRecordingPage.$static.scheduledRecordingDefendantsLabel.locator('[data-control-part="text"]'),
            [[defendant, '{redacted-defendant}']],
          );
        }
      });

      await test.step('Verify upon accessing schedule recording page, it is visually correct', async () => {
        const maskedElements = [
          scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
          scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
          scheduleRecordingPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
        ];

        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(async () => {
          await expect(page).toHaveScreenshot('schedule-recordings-page-booking-has-recording-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );
});
