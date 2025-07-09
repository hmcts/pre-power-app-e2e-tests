import { test, expect } from '../../fixtures';
import { config } from '../../utils';
import { CaseDetailsType } from '../../page-objects/pages';
import { faker } from '@faker-js/faker';

test.describe('Set of tests to verify case details page', () => {
  test.use({ storageState: config.users.preUser.sessionFile });

  test.beforeEach(async ({ homePage, caseDetailsPage }) => {
    await homePage.goTo();
    await homePage.verifyUserIsOnHomePage();
    await homePage.$interactive.bookARecordingButton.click();
    await caseDetailsPage.verifyUserIsOnCaseDetailsPage();
  });

  test(
    'Verify user is able to open a new case and is redirected to the schedule recordings page',
    {
      tag: '@smoke',
    },
    async ({ caseDetailsPage, dataUtils, scheduleRecordingPage }) => {
      const caseDetails: CaseDetailsType = dataUtils.generateRandomCaseDetails(2, 2);

      await caseDetailsPage.populateCaseDetails({
        caseReference: caseDetails.caseReference,
        defendants: caseDetails.defendants,
        witnesses: caseDetails.witnesses,
      });

      await caseDetailsPage.$interactive.saveButton.click();
      await expect(caseDetailsPage.$static.saveCaseSuccessLogo).toBeVisible();
      await expect(caseDetailsPage.$static.saveCaseSuccessText).toBeVisible();
      await scheduleRecordingPage.verifyUserIsOnScheduleRecordingsPage();
    },
  );

  test(
    'Verify case reference containing less than 9 characters is rejected',
    {
      tag: '@Regression',
    },
    async ({ caseDetailsPage, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out defendant and wintness fields with valid values', async () => {
        await caseDetailsPage.$inputs.defendants.fill(dataUtils.generateRandomNames('fullName', 1)[0]);
        await caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });

      for (const length of [0, 8]) {
        const value = faker.string.alphanumeric(length);
        await caseDetailsPage.$inputs.caseReference.clear();
        await caseDetailsPage.$inputs.caseReference.fill(value);
        await caseDetailsPage.$interactive.saveButton.click();

        await expect(caseDetailsPage.$static.validationErrorHeading).toBeVisible();
        await expect(caseDetailsPage.$static.validationErrorText).toBeVisible();
        await expect(caseDetailsPage.$static.validationErrorText).toHaveText('Please enter a case reference between 9 and 13 characters.');

        await caseDetailsPage.$interactive.validationErrorCloseButton.click();
        await expect(caseDetailsPage.$static.validationErrorHeading).toBeHidden();
      }
    },
  );

  test(
    'Verify case reference field trims values above 13 characters',
    {
      tag: '@Regression',
    },
    async ({ caseDetailsPage }) => {
      const value = faker.string.alphanumeric(14);
      await caseDetailsPage.$inputs.caseReference.fill(value);
      await expect(caseDetailsPage.$inputs.caseReference).toHaveValue(value.slice(0, 13));
    },
  );

  test(
    'Verify case reference containing special characters is rejected',
    {
      tag: '@Regression',
    },
    async ({ caseDetailsPage, dataUtils }) => {
      await test.step('Fill out prerequisite fields with valid data', async () => {
        await caseDetailsPage.$inputs.defendants.fill(dataUtils.generateRandomNames('fullName', 1)[0]);
        await caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });

      const specialCharacters = Array.from(new Set(';#<>?+_{}@:~=¬`|\\/*&^%$£"!'));

      for (const char of specialCharacters) {
        await test.step(`Validate invalid case reference containing special character '${char}' is rejected`, async () => {
          const invalidValue = faker.string.alphanumeric(12) + char;

          await caseDetailsPage.$inputs.caseReference.clear();
          await caseDetailsPage.$inputs.caseReference.fill(invalidValue);
          await caseDetailsPage.$interactive.saveButton.click();

          const errorTextLocator = caseDetailsPage.$static.validationErrorText;
          const headingLocator = caseDetailsPage.$static.validationErrorHeading;

          await expect(headingLocator).toBeVisible();
          await expect(errorTextLocator).toBeVisible();
          await expect(errorTextLocator).toHaveText('Case reference cannot include special characters: ;#<?>+_{}@:~=¬`|\\/*&^%$£""!');

          await caseDetailsPage.$interactive.validationErrorCloseButton.click();
          await expect(headingLocator).toBeHidden();
        });
      }
    },
  );

  test(
    'Verify Defendants field when left emnpty shows validation error ',
    {
      tag: '@Regression',
    },
    async ({ caseDetailsPage, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out case Reference and wintness fields with valid values', async () => {
        await caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });

      await caseDetailsPage.$interactive.saveButton.click();
      await expect(caseDetailsPage.$static.validationErrorHeading).toBeVisible();
      await expect(caseDetailsPage.$static.validationErrorText).toBeVisible();
      await expect(caseDetailsPage.$static.validationErrorText).toHaveText('Please enter a defendant name into the defendant field.');
    },
  );

  test(
    'Verify Defendants first name or Last name containing more than 25 characters are rejected',
    {
      tag: '@Regression',
    },
    async ({ caseDetailsPage, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out case Reference and witness fields with valid values', async () => {
        await caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });
      const validationErrorHeading = caseDetailsPage.$static.validationErrorHeading;
      const validationErrorText = caseDetailsPage.$static.validationErrorText;

      await test.step('Verify defendants first name containing more than 25 is rejected', async () => {
        const firstName = faker.string.alpha(26);
        const lastName = faker.string.alpha(10);
        await caseDetailsPage.$inputs.defendants.fill(`${firstName} ${lastName}`);

        await caseDetailsPage.$interactive.saveButton.click();
        await expect(validationErrorHeading).toBeVisible();
        await expect(validationErrorText).toBeVisible();
        await expect(validationErrorText).toHaveText('Defendant name must be between 1 and 25 characters.');
        await caseDetailsPage.$interactive.validationErrorCloseButton.click();
        await expect(validationErrorHeading).toBeHidden();
      });
      await test.step('Verify defendants last name containing more than 25 is rejected', async () => {
        const firstName = faker.string.alpha(10);
        const lastName = faker.string.alpha(26);
        await caseDetailsPage.$inputs.defendants.fill(`${firstName} ${lastName}`);

        await caseDetailsPage.$interactive.saveButton.click();
        await expect(validationErrorHeading).toBeVisible();
        await expect(validationErrorText).toBeVisible();
        await expect(validationErrorText).toHaveText('Defendant name must be between 1 and 25 characters.');
      });
    },
  );

  test(
    'Verify Defendants containing first name only is rejected',
    {
      tag: '@Regression',
    },
    async ({ caseDetailsPage, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out case Reference and wintness fields with valid values', async () => {
        await caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });
      const firstName = dataUtils.generateRandomNames('firstName', 1)[0];
      await caseDetailsPage.$inputs.defendants.fill(firstName);

      await caseDetailsPage.$interactive.saveButton.click();
      await expect(caseDetailsPage.$static.validationErrorHeading).toBeVisible();
      await expect(caseDetailsPage.$static.validationErrorText).toBeVisible();
      await expect(caseDetailsPage.$static.validationErrorText).toHaveText('Defendant names should be first and last name only.');
    },
  );

  test(
    'Verify Defendants name containing special characters is rejected',
    {
      tag: '@Regression',
    },
    async ({ caseDetailsPage, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out case Reference and witness fields with valid values', async () => {
        await caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });

      const specialCharacters = Array.from(new Set(';#<>?+_{}@:~=¬`|\\/*&^%$£"!'));

      for (const char of specialCharacters) {
        await test.step(`Validate Defendants name containing special character '${char}' is rejected`, async () => {
          const invalidValue = dataUtils.generateRandomNames('fullName', 1)[0] + char;
          await caseDetailsPage.$inputs.defendants.clear();
          await caseDetailsPage.$inputs.defendants.fill(invalidValue);
          await caseDetailsPage.$interactive.saveButton.click();

          const errorTextLocator = caseDetailsPage.$static.validationErrorText;
          const headingLocator = caseDetailsPage.$static.validationErrorHeading;

          await expect(headingLocator).toBeVisible();
          await expect(errorTextLocator).toBeVisible();
          await expect(errorTextLocator).toHaveText('Defendant name cannot include special characters: ;#<?>+_{}@:~=¬`|\\/*&^%$£\\""!');

          await caseDetailsPage.$interactive.validationErrorCloseButton.click();
          await expect(headingLocator).toBeHidden();
        });
      }
    },
  );
});
