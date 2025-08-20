/* eslint-disable playwright/no-skipped-test */
import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';

test.describe('Set of tests to verify the case details page UI is visually correct', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeAll(async ({ headless }) => {
    test.skip(!headless, 'Skipping visual tests in headed mode');
  });

  test.beforeEach(async ({ navigateToCaseDetailsPage }) => {
    await navigateToCaseDetailsPage();
  });

  test(
    'Verify when accessing case details page, it is visually correct',
    {
      tag: ['@regression', '@visual'],
    },
    async ({ page, caseDetailsPage }) => {
      const maskedElements = [
        caseDetailsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
      ];

      await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

      await expect(async () => {
        await expect(page).toHaveScreenshot('case-details-page-visual.png', {
          mask: maskedElements,
        });
      }).toPass({ intervals: [2000], timeout: 15000 });
    },
  );

  test(
    'Verify error message is visualy correct when trying to create a case with null values',
    {
      tag: ['@regression', '@visual'],
    },
    async ({ page, caseDetailsPage }) => {
      const maskedElements = [
        caseDetailsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
      ];

      await test.step('Attempt to create a case with null values', async () => {
        await caseDetailsPage.$interactive.saveButton.click();
        await expect(caseDetailsPage.$validationErrorModal.modalWindow).toBeVisible();
      });

      await test.step('Verify error message is visually correct', async () => {
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));
        await expect(async () => {
          await expect(page).toHaveScreenshot('case-details-page-error-validation-modal-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify when searching for a case, it is visually correct',
    {
      tag: ['@regression', '@visual'],
    },
    async ({ page, caseDetailsPage }) => {
      await test.step('Pre-requisite step in order to begin searching for a case', async () => {
        await caseDetailsPage.$inputs.caseReference.fill('PR-');
        await expect(caseDetailsPage.$inputs.caseReference).toHaveValue('PR-');
      });

      await test.step('Verify UI is visually correct when searching for a case', async () => {
        const maskedElements = [
          caseDetailsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
          caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
          caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
          caseDetailsPage.$maskedlocatorsForVisualTesting.searchResultExistingCaseContainer,
        ];

        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(async () => {
          await expect(page).toHaveScreenshot('case-details-page-search-for-case-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify when selecting an existing case, it is visually correct',
    {
      tag: ['@regression', '@visual'],
    },
    async ({ page, caseDetailsPage, apiClient }) => {
      await test.step('Pre-requisite step in order to create a new case to search and select', async () => {
        const caseDetails = await apiClient.createCase(2, 2);
        await caseDetailsPage.searchAndSelectExistingCase(caseDetails.caseReference);
      });

      await test.step('Verify UI is visually correct once an existing case has been selected', async () => {
        const maskedElements = [
          caseDetailsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
          caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
          caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
          caseDetailsPage.$static.searchResultExistingCaseReference,
          caseDetailsPage.$static.selectedExistingCaseReferenceLabel,
          caseDetailsPage.$inputs.defendants,
          caseDetailsPage.$inputs.witnesses,
        ];

        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        // Added the following click to ensure focus is removed from any given element
        await page.click('body');

        await expect(async () => {
          await expect(page).toHaveScreenshot('case-details-page-selected-existing-case-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify once option to close case has been selected, it is visually correct',
    {
      tag: ['@regression', '@visual'],
    },
    async ({ page, caseDetailsPage, apiClient, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to create a new case to search and select', async () => {
        const caseDetails = await apiClient.createCase(2, 2);
        await caseDetailsPage.searchAndSelectExistingCase(caseDetails.caseReference);
      });

      const sharedMaskedElements = [
        caseDetailsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
        caseDetailsPage.$static.selectedExistingCaseReferenceLabel,
      ];

      /* 
      The following elements are hidden oppose to using playwrights masking feature becase
      the elements overlap with the modal that appears when closing a case.
      This is a workaround to ensure the modal is visible in the screenshot.
      */
      const elementsToHide = [caseDetailsPage.$inputs.defendants, caseDetailsPage.$inputs.witnesses];
      await userInterfaceUtils.hideElements(elementsToHide);

      await test.step('Verify UI is visually correct once close case button has been selected', async () => {
        await caseDetailsPage.$interactive.selectedCaseCloseButton.click();
        await expect(caseDetailsPage.$closeCaseModal.closeCaseModalWindow).toBeVisible();
        const testStepMaskedElement = caseDetailsPage.$closeCaseModal.datePicker;

        const maskedElements = [...sharedMaskedElements, testStepMaskedElement];
        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('case-details-page-close-case-modal-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });

      await test.step('Verify UI is visualy correct once save option in close case modal has been selected', async () => {
        await caseDetailsPage.$closeCaseModal.saveButton.click();
        await expect(caseDetailsPage.$closeCaseModal.yesButton).toBeVisible();

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('case-details-page-select-save-option-in-close-case-modal-visual.png', {
              mask: sharedMaskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });

      await test.step('Verify UI is visualy correct once yes option in close case modal has been selected', async () => {
        await caseDetailsPage.$closeCaseModal.yesButton.click();
        await expect(caseDetailsPage.$closeCaseModal.closeCaseModalWindow).toBeHidden();

        const testStepMaskedElements = [caseDetailsPage.$static.closedCaseStatusInfo, caseDetailsPage.$static.searchResultExistingCaseReference];
        const maskedElements = [...sharedMaskedElements, ...testStepMaskedElements];

        await Promise.all(testStepMaskedElements.map((element) => expect(element).toBeAttached()));

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('case-details-page-select-yes-option-in-close-case-modal-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify when selecting option to cancel closure of an existing case, it is visually correct',
    {
      tag: ['@regression', '@visual'],
    },
    async ({ page, caseDetailsPage, apiClient, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to set a newly created case to status pending closure', async () => {
        const caseDetails = await apiClient.createCase(2, 2);
        await caseDetailsPage.searchAndSelectExistingCase(caseDetails.caseReference);
        await caseDetailsPage.setCaseToPendingClosure();
      });

      const maskedElements = [
        caseDetailsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
        caseDetailsPage.$static.selectedExistingCaseReferenceLabel,
      ];
      await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

      /* 
      The following elements are hidden oppose to using playwrights masking feature becase
      the elements overlap with the modal that appears when cancelling closure of case.
      This is a workaround to ensure the modal is visible in the screenshot.
      */
      const elementsToHide = [caseDetailsPage.$inputs.defendants, caseDetailsPage.$inputs.witnesses];
      await userInterfaceUtils.hideElements(elementsToHide);

      await test.step('Verify UI is visually correct once cancel button for case that is pending closure has been selected', async () => {
        const caseData = await apiClient.getCaseData();
        await caseDetailsPage.$interactive.selectedCaseCancelPendingClosureButton.click();
        await expect(caseDetailsPage.$cancelClosureOfCaseModal.cancelClosureOfCaseModalWindow).toBeVisible();

        // Replace dynamic text in the modal with placeholders for visual testing
        const dynamicTextArea = caseDetailsPage.$cancelClosureOfCaseModal.modalTextArea;
        await userInterfaceUtils.replaceTextWithinInput(dynamicTextArea, [
          [caseData.caseReference, '{masked-visual}'],
          [/\d{2}\/\d{2}\/\d{4}/, '{masked-visual}'],
        ]);

        await expect(async () => {
          await expect(page).toHaveScreenshot('case-details-page-cancel-closure-of-case-modal-visual.png', {
            mask: maskedElements,
          });
        }).toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );

  test(
    'Verify when selecting option to modify an existing case, it is visually correct',
    {
      tag: ['@regression', '@visual'],
    },
    async ({ page, caseDetailsPage, apiClient, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to setup a new case and search/select the new case', async () => {
        const caseDetails = await apiClient.createCase(1, 1);
        await caseDetailsPage.searchAndSelectExistingCase(caseDetails.caseReference);
      });

      const sharedMaskedElements = [
        caseDetailsPage.$globalMaskedlocatorsForVisualTesting.powerAppsHeaderContainer,
        caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationCourtTitle,
        caseDetailsPage.$globalMaskedlocatorsForVisualTesting.applicationEnvironment,
      ];

      await test.step('Verify UI is visually correct once user has selected option to modify case', async () => {
        await caseDetailsPage.$interactive.modifyButton.click();

        const testStepMaskedElement = [caseDetailsPage.$static.modifyCaseReferenceText, caseDetailsPage.$static.modifyCaseParticipantFullNameText];
        const maskedElements = [...sharedMaskedElements, ...testStepMaskedElement];

        await Promise.all(maskedElements.map((element) => expect(element.first()).toBeAttached()));

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('case-details-page-modify-case-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });

      await test.step('Verify UI is visually correct once user has selected option to modify case reference', async () => {
        await caseDetailsPage.$interactive.modifyCaseAmendCaseReferenceButton.click();
        await expect(caseDetailsPage.$interactive.modifyCaseAmendCaseReferenceButton).toBeHidden();

        const testStepMaskedElement = [
          caseDetailsPage.$static.modifyCaseParticipantFullNameText,
          caseDetailsPage.$inputs.modifyCaseAmendCaseReferenceInput,
        ];
        const maskedElements = [...sharedMaskedElements, ...testStepMaskedElement];

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('case-details-page-modify-case-reference-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });

        await caseDetailsPage.$interactive.modifyCaseCancelAmendmentOfCaseReferenceButton.click();
        await expect(caseDetailsPage.$interactive.modifyCaseCancelAmendmentOfCaseReferenceButton).toBeHidden();
      });

      await test.step('Hide participant full names so that they do not appear in screenshots for the remaining test steps', async () => {
        // This step has been added because masking the participant full names overlaps with the modal that appears when adding or modifying participants.
        await userInterfaceUtils.hideElements(caseDetailsPage.$static.modifyCaseParticipantFullNameText);
      });

      await test.step('Verify UI is visually correct once user has selected option to add new participant', async () => {
        await caseDetailsPage.$interactive.modifyCaseAddNewParticipantButton.click();
        await expect(caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.ModalWindow).toBeVisible();

        const testStepMaskedElement = caseDetailsPage.$static.modifyCaseReferenceText;
        const maskedElements = [...sharedMaskedElements, testStepMaskedElement];

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('case-details-page-modify-case-add-new-participant-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });

        await caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.cancelButton.click();
        await expect(caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.ModalWindow).toBeHidden();
      });

      await test.step('Verify UI is visually correct once user has selected option to amend existing witness', async () => {
        const caseData = await apiClient.getCaseData();
        await caseDetailsPage.$modifyCaseSelectOptionToAmendParticipant(caseData.witnessNames[0]);

        const testStepMaskedElement = [
          caseDetailsPage.$static.modifyCaseReferenceText,
          caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.firstNameInput,
        ];
        const maskedElements = [...sharedMaskedElements, ...testStepMaskedElement];

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('case-details-page-modify-case-amend-existing-witness-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });

        await caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.cancelButton.click();
        await expect(caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.ModalWindow).toBeHidden();
      });

      await test.step('Verify UI is visually correct once user has selected option to amend existing defendant', async () => {
        const caseData = await apiClient.getCaseData();
        await caseDetailsPage.$modifyCaseSelectOptionToAmendParticipant(caseData.defendantNames[0]);

        const testStepMaskedElement = [
          caseDetailsPage.$static.modifyCaseReferenceText,
          caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.firstNameInput,
          caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.lastNameInput,
        ];
        const maskedElements = [...sharedMaskedElements, ...testStepMaskedElement];

        await expect
          .soft(async () => {
            await expect(page).toHaveScreenshot('case-details-page-modify-case-amend-existing-defendant-visual.png', {
              mask: maskedElements,
            });
          })
          .toPass({ intervals: [2000], timeout: 15000 });
      });
    },
  );
});
