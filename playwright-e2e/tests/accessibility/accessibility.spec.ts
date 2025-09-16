import { test, expect } from '../../fixtures';
import { config } from '../../utils';

test.describe('Set of tests to verify accessibility of pages within pre power apps', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test(
    'Verify accessibility on home page',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToHomePage, axeUtils }) => {
      await test.step('Navigate to home page', async () => {
        await navigateToHomePage();
      });

      await test.step('Check accessibility on home page', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility on case details page',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToCaseDetailsPage, axeUtils }) => {
      await test.step('Select option to book a recording in order to navigate to case details page', async () => {
        await navigateToCaseDetailsPage();
      });

      await test.step('Check accessibility on case details page', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility on case details page once user begins searching for a case',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToCaseDetailsPage, caseDetailsPage, axeUtils }) => {
      await test.step('Select option to book a recording in order to navigate to case details page', async () => {
        await navigateToCaseDetailsPage();
      });

      await test.step('Search for cases beginning with PR- to obtain a list of existing cases', async () => {
        await caseDetailsPage.$inputs.caseReference.fill('PR-');
        await expect(caseDetailsPage.$static.searchResultExistingCasesTitle).toBeVisible();
      });

      await test.step('Check accessibility on case details page', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility on case details page once user has selected an existing case from the search results',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToCaseDetailsPage, caseDetailsPage, axeUtils, apiClient }) => {
      await test.step('Pre-requisite step in order to setup an existing case via api', async () => {
        await apiClient.createCase(2, 2);
      });

      await test.step('Select option to book a recording in order to navigate to case details page', async () => {
        await navigateToCaseDetailsPage();
      });

      await test.step('Search and select an existing case', async () => {
        const caseData = await apiClient.getCaseData();
        await caseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);
      });

      await test.step('Check accessibility on case details page', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility on case details page once user has selected option to modify an existing case from the search results',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToCaseDetailsPage, caseDetailsPage, axeUtils, apiClient }) => {
      await test.step('Pre-requisite step in order to setup an existing case via api', async () => {
        await apiClient.createCase(2, 2);
      });

      await test.step('Select option to book a recording in order to navigate to case details page', async () => {
        await navigateToCaseDetailsPage();
      });

      await test.step('Search and select an existing case', async () => {
        const caseData = await apiClient.getCaseData();
        await caseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);
      });

      await test.step('Select option to modify case that has been selected', async () => {
        await caseDetailsPage.$interactive.modifyButton.click();
        await expect(caseDetailsPage.$static.modifyCaseReferenceText).toBeVisible();
      });

      await test.step('Check accessibility on case details page', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility on schedule a recording page',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToScheduleRecordingsPage, axeUtils, apiClient }) => {
      await test.step('Pre-requisite step in order to setup an existing case with a booking assigned via api', async () => {
        await apiClient.createBooking(2, 2, 'today');
      });

      await test.step('Select option to book a recording in order to navigate to schedule recording page', async () => {
        const caseData = await apiClient.getCaseData();
        await navigateToScheduleRecordingsPage(caseData.caseReference);
      });

      await test.step('Check accessibility on schedule recordings page', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility on manage bookings page',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToManageBookingsPage, axeUtils }) => {
      await test.step('Navigate to manage bookings page', async () => {
        await navigateToManageBookingsPage();
      });

      await test.step('Check accessibility on manage bookings page', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility when selecting option to manage an existing case on manage bookings page',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToManageBookingsPage, manageBookingsPage, axeUtils, apiClient }) => {
      await test.step('Pre-requisite step in order to setup an existing case with a booking assigned via api', async () => {
        await apiClient.createBooking(2, 2, 'today');
      });

      await test.step('Navigate to manage bookings page and search for an existing case', async () => {
        await navigateToManageBookingsPage();
        const caseData = await apiClient.getCaseData();
        await manageBookingsPage.searchForABooking(caseData.caseReference);
      });

      await test.step('Select option to manage existing case', async () => {
        await manageBookingsPage.$interactive.manageButton.click();
        await expect(manageBookingsPage.$manageCaseModal.modalWindow).toBeVisible();
      });

      await test.step('Check accessibility of manage modal on manage bookings page', async () => {
        await axeUtils.audit();
      });

      await test.step('Select option to audit within manage bookings modal', async () => {
        await manageBookingsPage.$manageCaseModal.auditButton.click();
        await expect(manageBookingsPage.$manageCaseModal.auditCaseInformationText).toBeVisible();
      });

      await test.step('Check accessibility of audit option within manage bookings modal', async () => {
        await axeUtils.audit();
      });

      await test.step('Select option to share within manage bookings modal', async () => {
        await manageBookingsPage.$manageCaseModal.closeAuditButton.click();
        await manageBookingsPage.$manageCaseModal.shareButton.click();
        await expect(manageBookingsPage.$manageCaseModal.grantAccessButton).toBeVisible();
      });

      await test.step('Check accessibility of share option within manage bookings modal', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility when selecting option to amend an existing case on manage bookings page',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToManageBookingsPage, manageBookingsPage, axeUtils, apiClient }) => {
      await test.step('Pre-requisite step in order to setup an existing case with a booking assigned via api', async () => {
        await apiClient.createBooking(2, 2, 'today');
      });

      await test.step('Navigate to manage bookings page and search for an existing case', async () => {
        await navigateToManageBookingsPage();
        const caseData = await apiClient.getCaseData();
        await manageBookingsPage.searchForABooking(caseData.caseReference);
      });

      await test.step('Select option to amend existing case', async () => {
        await manageBookingsPage.$interactive.amendButton.click();
        await expect(manageBookingsPage.$amendCaseModal.modalWindow).toBeVisible();
      });

      await test.step('Check accessibility of amend modal on manage bookings page', async () => {
        await axeUtils.audit();
      });

      await test.step('Select option to delete case via amend modal', async () => {
        await manageBookingsPage.$amendCaseModal.deleteButton.click();
        await expect(manageBookingsPage.$amendCaseModal.deleteCaseText).toBeVisible();
      });

      await test.step('Check accessibility of delete option within amend modal', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility on view live recording page',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToViewLiveFeedPage, axeUtils, apiClient }) => {
      test.fail(true, 'Bug raised on PRE team board - S28-4336');

      await test.step('Pre-requisite step in order to setup an existing case with a booking assigned via api', async () => {
        await apiClient.createBooking(2, 2, 'today');
      });

      await test.step('Select option to record on manage bookings page in order to navigate to view live recording page', async () => {
        const caseData = await apiClient.getCaseData();
        await navigateToViewLiveFeedPage(caseData.caseReference);
      });

      await test.step('Check accessibility on view live recording page', async () => {
        await axeUtils.audit();
      });
    },
  );

  test(
    'Verify accessibility on view recordings page',
    {
      tag: ['@accessibility'],
    },
    async ({ navigateToViewRecordingsPage, axeUtils }) => {
      await test.step('Navigate to view recordings page', async () => {
        await navigateToViewRecordingsPage();
      });

      await test.step('Check accessibility on view recordings page', async () => {
        await axeUtils.audit();
      });
    },
  );
});
