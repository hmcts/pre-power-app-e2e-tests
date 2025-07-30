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
      tag: '@visual',
    },
    async ({ page, caseDetailsPage }) => {
      const maskedElements = [
        caseDetailsPage.$globalMaskedLocatersForVisualTesting.powerAppsHeaderContainer,
        caseDetailsPage.$globalMaskedLocatersForVisualTesting.applicationCourtTitle,
        caseDetailsPage.$globalMaskedLocatersForVisualTesting.applicationEnvironment,
      ];

      await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

      await expect(page).toHaveScreenshot('case-details-page-visual.png', {
        mask: maskedElements,
      });
    },
  );

  test(
    'Verify when searching for a case, it is visually correct',
    {
      tag: '@visual',
    },
    async ({ page, caseDetailsPage }) => {
      await test.step('Pre-requisite step in order to begin searching for a case', async () => {
        await caseDetailsPage.$inputs.caseReference.fill('PR-');
        await expect(caseDetailsPage.$inputs.caseReference).toHaveValue('PR-');
      });

      await test.step('Verify UI is visually correct when searching for a case', async () => {
        const maskedElements = [
          caseDetailsPage.$globalMaskedLocatersForVisualTesting.powerAppsHeaderContainer,
          caseDetailsPage.$globalMaskedLocatersForVisualTesting.applicationCourtTitle,
          caseDetailsPage.$globalMaskedLocatersForVisualTesting.applicationEnvironment,
          caseDetailsPage.$maskedLocatersForVisualTesting.searchResultExistingCaseContainer,
        ];

        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(page).toHaveScreenshot('case-details-page-search-for-case-visual.png', {
          mask: maskedElements,
        });
      });
    },
  );

  test(
    'Verify when selecting an existing case, it is visually correct',
    {
      tag: '@visual',
    },
    async ({ page, caseDetailsPage, apiClient }) => {
      await test.step('Pre-requisite step in order to create a new case to search and select', async () => {
        const caseDetails = await apiClient.createCase(2, 2);
        await caseDetailsPage.searchAndSelectExistingCase(caseDetails.caseReference);
      });

      await test.step('Verify UI is visually correct once an existing case has been selected', async () => {
        const maskedElements = [
          caseDetailsPage.$globalMaskedLocatersForVisualTesting.powerAppsHeaderContainer,
          caseDetailsPage.$globalMaskedLocatersForVisualTesting.applicationCourtTitle,
          caseDetailsPage.$globalMaskedLocatersForVisualTesting.applicationEnvironment,
          caseDetailsPage.$static.searchResultExistingCaseReference,
          caseDetailsPage.$static.selectedExistingCaseReferenceLable,
          caseDetailsPage.$inputs.defendants,
          caseDetailsPage.$inputs.witnesses,
        ];

        await Promise.all(maskedElements.map((element) => expect(element).toBeAttached()));

        await expect(page).toHaveScreenshot('case-details-page-selected-existing-case-visual.png', {
          mask: maskedElements,
        });
      });
    },
  );

  test(
    'Verify once option to close case has been selected, it is visually correct',
    {
      tag: '@visual',
    },
    async ({ page, caseDetailsPage, apiClient, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to create a new case to search and select', async () => {
        const caseDetails = await apiClient.createCase(2, 2);
        await caseDetailsPage.searchAndSelectExistingCase(caseDetails.caseReference);
      });

      const sharedMaskedElements = [
        caseDetailsPage.$globalMaskedLocatersForVisualTesting.powerAppsHeaderContainer,
        caseDetailsPage.$globalMaskedLocatersForVisualTesting.applicationCourtTitle,
        caseDetailsPage.$globalMaskedLocatersForVisualTesting.applicationEnvironment,
        caseDetailsPage.$static.selectedExistingCaseReferenceLable,
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
        await expect(page).toHaveScreenshot('case-details-page-close-case-modal-visual.png', {
          mask: maskedElements,
        });
      });

      await test.step('Verify UI is visualy correct once save option in close case modal has been selected', async () => {
        await caseDetailsPage.$closeCaseModal.saveButton.click();
        await expect(caseDetailsPage.$closeCaseModal.yesButton).toBeVisible();

        await expect(page).toHaveScreenshot('case-details-page-select-save-option-in-close-case-modal-visual.png', {
          mask: sharedMaskedElements,
        });
      });

      await test.step('Verify UI is visualy correct once yes option in close case modal has been selected', async () => {
        await caseDetailsPage.$closeCaseModal.yesButton.click();
        await expect(caseDetailsPage.$closeCaseModal.closeCaseModalWindow).toBeHidden();

        const testStepMaskedElements = [caseDetailsPage.$static.closedCaseStatusInfo, caseDetailsPage.$static.searchResultExistingCaseReference];
        const maskedElements = [...sharedMaskedElements, ...testStepMaskedElements];

        await Promise.all(testStepMaskedElements.map((element) => expect(element).toBeAttached()));
        await expect(page).toHaveScreenshot('case-details-page-select-yes-option-in-close-case-modal-visual.png', {
          mask: maskedElements,
        });
      });
    },
  );

  test(
    'Verify when selecting option to cancel closure of an existing case, it is visually correct',
    {
      tag: '@visual',
    },
    async ({ page, caseDetailsPage, apiClient, userInterfaceUtils }) => {
      await test.step('Pre-requisite step in order to set a newly created case to status pending closure', async () => {
        const caseDetails = await apiClient.createCase(2, 2);
        await caseDetailsPage.searchAndSelectExistingCase(caseDetails.caseReference);
        await caseDetailsPage.setCaseToPendingClosure();
      });

      const maskedElements = [
        caseDetailsPage.$globalMaskedLocatersForVisualTesting.powerAppsHeaderContainer,
        caseDetailsPage.$globalMaskedLocatersForVisualTesting.applicationCourtTitle,
        caseDetailsPage.$globalMaskedLocatersForVisualTesting.applicationEnvironment,
        caseDetailsPage.$static.selectedExistingCaseReferenceLable,
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
        await userInterfaceUtils.replaceTextWithinTextArea(dynamicTextArea, [
          [caseData.caseReference, 'XXXXXXXXXXXXX'],
          [/\d{2}\/\d{2}\/\d{4}/, 'DD/MM/YYYY'],
        ]);

        await expect(page).toHaveScreenshot('case-details-page-cancel-closure-of-case-modal-visual.png', {
          mask: maskedElements,
        });
      });
    },
  );
});
