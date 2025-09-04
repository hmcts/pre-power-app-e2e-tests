/* eslint-disable playwright/no-skipped-test */
import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';

test.describe('Set of tests to verify the manage bookings page UI is visually correct', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeAll(async ({ headless }) => {
    test.skip(!headless, 'Skipping visual tests in headed mode');
  });

  test.beforeEach(async ({ navigateToManageBookingsPage }) => {
    await navigateToManageBookingsPage();
  });

  test(
    'Verify manage bookings page is visually correct',
    {
      tag: ['@visual'],
    },
    async ({ page, manageBookingsPage }) => {
      const maskedElements = [
        manageBookingsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        manageBookingsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        manageBookingsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
        manageBookingsPage.$static.searchResultGallery,
      ];

      await test.step('Verify manage bookings page is visually correct', async () => {
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(async () => {
          await expect(page).toHaveScreenshot('manage-bookings-page-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify whilst searching for an existing case, the manage bookings page is visually correct',
    {
      tag: ['@visual'],
    },
    async ({ page, manageBookingsPage, apiClient, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to create a case and assign a booking via api', async () => {
        await apiClient.createBooking(2, 2, 'today');
      });

      await test.step('Search for an existing case and redact test data', async () => {
        const caseData = await apiClient.getBookingData();
        await manageBookingsPage.searchForABooking(caseData.caseReference);

        await userInterfaceUtils.replaceTextWithinStaticElement(manageBookingsPage.$static.listItemsInSearchResultsGallery, [
          [caseData.caseReference, '{Redacted}'],
          [caseData.witnessSelectedForCaseRecording, '{Redacted}'],
          [/\b\d{2}\/\d{2}\/\d{4}\b/g, '{Redacted}'],
        ]);

        for (const defendant of caseData.defendantNames) {
          await userInterfaceUtils.replaceTextWithinStaticElement(manageBookingsPage.$static.listItemsInSearchResultsGallery, [
            [defendant, '{Redacted}'],
          ]);
        }

        // Added the following click to ensure focus is removed from any given element
        await page.click('body');
      });

      await test.step('Verify manage bookings page is visually correct', async () => {
        const maskedElements = [
          manageBookingsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
          manageBookingsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
          manageBookingsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
          manageBookingsPage.$inputs.caseReference,
        ];

        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(async () => {
          await expect(page).toHaveScreenshot('manage-bookings-page-search-for-existing-case-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify booking page is visually correct when user selects option to manage an existing booking',
    {
      tag: ['@visual'],
    },
    async ({ page, manageBookingsPage, apiClient, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to create a case and assign a booking via api', async () => {
        await apiClient.createBooking(2, 2, 'today');
      });

      const maskedElements = [
        manageBookingsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        manageBookingsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        manageBookingsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
      ];

      const caseData = await apiClient.getBookingData();

      await test.step('Search for an existing case and select option to manage case', async () => {
        await manageBookingsPage.searchForABooking(caseData.caseReference);
        await manageBookingsPage.$interactive.manageButton.click();
        await expect(manageBookingsPage.$manageCaseModal.modalWindow).toBeVisible();
      });

      await test.step('Redact dynamic test data', async () => {
        await userInterfaceUtils.replaceTextWithinStaticElement(manageBookingsPage.$static.listItemsInSearchResultsGallery, [
          [caseData.caseReference, '{Redacted}'],
          [caseData.witnessSelectedForCaseRecording, '{Redacted}'],
        ]);

        await userInterfaceUtils.hideElements(manageBookingsPage.$inputs.caseReference);
      });

      await test.step('Verify manage booking modal is visually correct', async () => {
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('manage-bookings-page-manage-booking-modal-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });

      await test.step('Select audit option and redact test data', async () => {
        await manageBookingsPage.$manageCaseModal.auditButton.click();
        await expect(manageBookingsPage.$manageCaseModal.auditButton).toBeHidden();

        await userInterfaceUtils.replaceTextWithinStaticElement(manageBookingsPage.$manageCaseModal.auditCaseInformationText, [
          [caseData.caseReference, '{Redacted}'],
          [/\b\d{2}\/\d{2}\/\d{4}\b/g, '{Redacted}'],
          [caseData.witnessSelectedForCaseRecording, '{Redacted}'],
        ]);

        for (const defendant of caseData.defendantNames) {
          await userInterfaceUtils.replaceTextWithinStaticElement(manageBookingsPage.$manageCaseModal.auditCaseInformationText, [
            [defendant, '{Redacted}'],
          ]);
        }

        await userInterfaceUtils.replaceTextWithinStaticElement(manageBookingsPage.$manageCaseModal.auditReportDateLabel, [
          [/\b\d{2}\/\d{2}\/\d{4}\b/g, '{Redacted}'],
        ]);
      });

      await test.step('Verify audit information is visually correct', async () => {
        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('manage-booking-modal-audit-selected-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });

      await test.step('Close audit and select option to share', async () => {
        await manageBookingsPage.$manageCaseModal.closeAuditButton.click();
        await expect(manageBookingsPage.$manageCaseModal.closeAuditButton).toBeHidden();
        await manageBookingsPage.$manageCaseModal.shareButton.click();
        await expect(manageBookingsPage.$manageCaseModal.shareButton).toBeHidden();
      });

      await test.step('Verify whilst sharing booking, it is visually correct', async () => {
        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('manage-booking-modal-share-option-selected-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify booking page is visually correct when user selects option to amend an existing booking',
    {
      tag: ['@visual'],
    },
    async ({ page, manageBookingsPage, apiClient, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to create a case and assign a booking via api', async () => {
        await apiClient.createBooking(2, 2, 'today');
      });

      const maskedElements = [
        manageBookingsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        manageBookingsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        manageBookingsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
      ];

      const caseData = await apiClient.getBookingData();

      await test.step('Search for an existing case and select option to manage case', async () => {
        await manageBookingsPage.searchForABooking(caseData.caseReference);
        await manageBookingsPage.$interactive.amendButton.click();
        await expect(manageBookingsPage.$amendCaseModal.modalWindow).toBeVisible();
      });

      await test.step('Redact dynamic test data', async () => {
        await userInterfaceUtils.replaceTextWithinStaticElement(manageBookingsPage.$static.listItemsInSearchResultsGallery, [
          [caseData.caseReference, '{Redacted}'],
          [caseData.witnessSelectedForCaseRecording, '{Redacted}'],
        ]);

        await userInterfaceUtils.hideElements(manageBookingsPage.$inputs.caseReference);

        await userInterfaceUtils.replaceTextWithinInput(manageBookingsPage.$amendCaseModal.caseReferenceText.locator('input'), [
          [caseData.caseReference, '{Redacted}'],
        ]);
        await userInterfaceUtils.replaceTextWithinStaticElement(manageBookingsPage.$amendCaseModal.witnessDropdown, [
          [caseData.witnessSelectedForCaseRecording, '{Redacted}'],
        ]);
        for (const defendant of caseData.defendantNames) {
          await userInterfaceUtils.replaceTextWithinStaticElement(manageBookingsPage.$amendCaseModal.defendantsDropdown, [[defendant, '{Redacted}']]);
        }
        await userInterfaceUtils.replaceTextWithinInput(manageBookingsPage.$amendCaseModal.dateDropdown.locator('input'), [
          [/\b\d{2}\/\d{2}\/\d{4}\b/g, '01/01/0001'],
        ]);
      });

      await test.step('Verify amend booking modal is visually correct', async () => {
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('manage-bookings-page-amend-booking-modal-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });

      await test.step('Select option to delete case and redact dynamic test data', async () => {
        await manageBookingsPage.$amendCaseModal.deleteButton.click();
        await expect(manageBookingsPage.$amendCaseModal.deleteCaseText).toBeVisible();

        await userInterfaceUtils.replaceTextWithinStaticElement(manageBookingsPage.$amendCaseModal.deleteCaseText, [
          [caseData.caseReference, '{Redacted}'],
          [/\b\d{2}\/\d{2}\/\d{4}\b/g, '01/01/0001'],
          [caseData.witnessSelectedForCaseRecording, '{Redacted}'],
        ]);

        for (const defendant of caseData.defendantNames) {
          await userInterfaceUtils.replaceTextWithinStaticElement(manageBookingsPage.$amendCaseModal.deleteCaseText, [[defendant, '{Redacted}']]);
        }
      });

      await test.step('Upon selecting option to delete case, verify amend booking modal is visually correct', async () => {
        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('amend-booking-modal-delete-option-selected-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });

      await test.step('Select option to cancel deletion of case and cancel amendmendts', async () => {
        await manageBookingsPage.$amendCaseModal.noToDeleteButton.click();
        await expect(manageBookingsPage.$amendCaseModal.noToDeleteButton).toBeHidden();
        await manageBookingsPage.$amendCaseModal.cancelButton.click();
        await expect(manageBookingsPage.$amendCaseModal.yesToCancelButton).toBeVisible();
      });

      await test.step('Upon selecting option to cancel case amendments, verify amend booking modal is visually correct', async () => {
        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('amend-booking-modal-cancel-amendments-option-selected-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );
});
