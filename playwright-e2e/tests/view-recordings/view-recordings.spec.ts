import { test, expect } from '../../fixtures';
import { config } from '../../utils';

test.describe('Set of tests to verify view recordings page for Level 1 user', () => {
  const user = config.powerAppUsers.preLevel1User;
  test.use({ storageState: user.sessionFile });

  test.beforeEach(async ({ navigateToViewRecordingsPage, apiClient }) => {
    await apiClient.createANewCaseAndAssignRecording(2, 2);
    await navigateToViewRecordingsPage();
  });

  test(
    'Verify user is able to search for a case and confirm the list search details are correct',
    {
      tag: '@smoke',
    },
    async ({ apiClient, viewRecordingsPage }) => {
      const bookingData = await apiClient.getBookingData();
      const recordingData = await apiClient.getRecordingData();
      await viewRecordingsPage.searchForCaseReference(bookingData.caseReference);

      // Verify case reference label contains the correct case reference
      await expect(viewRecordingsPage.$static.caseReferenceLabelInSearchList).toHaveText(`Case Reference: ${bookingData.caseReference}`);
      // Verify version label is correct
      await expect(viewRecordingsPage.$static.recordingVersionLabelInSearchList).toHaveText('V.1');
      // Veirfy court label contains text 'Court:'
      await expect(viewRecordingsPage.$static.courtLabelInSearchList).toContainText('Court:');
      // Verify recording ID label contains the correct recording ID
      await expect(viewRecordingsPage.$static.recordingIdLabelInSearchList).toHaveText(`Recording UID: ${recordingData.recordingId}`);
      // Verify witness label contains the correct witness names
      for (const witnessName of bookingData.witnessNames) {
        await expect(viewRecordingsPage.$static.WitnessLabelInSearchList.filter({ hasText: 'Witness:' })).toContainText(witnessName);
      }
      // Verify defendant label contains the correct defendant name
      await expect(viewRecordingsPage.$static.defendantLabelInSearchList).toHaveText(`Defendants: ${bookingData.defendantSelectedForCase}`);
      // Verify recording date label contains the correct recording date and time
      await expect(viewRecordingsPage.$static.recordingDateLabelInSearchList).toHaveText(
        `Recording Date: ${recordingData.recordingDate} ${recordingData.recordingTime}`,
      );
      // Verify recording source label has the correct recording source
      await expect(viewRecordingsPage.$static.recordingSourceLabelInSearchList).toHaveText('Source: PRE');
      // Verify recording duration label has the correct recording duration
      await expect(viewRecordingsPage.$static.recordingDurationLabelInSearchList).toHaveText(`Duration: ${recordingData.recordingDuration}`);
      // Verify status label contains the correct text
      await expect(viewRecordingsPage.$static.StatusLabelInSearchList).toHaveText('Status: ');
      // Verify case status label contains the correct case status
      await expect(viewRecordingsPage.$static.caseStatusLabelInSearchList).toHaveText('Active');
    },
  );
});
